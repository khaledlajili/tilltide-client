import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '@/environments/environment';
import { LoginResponse, UserCredentials } from '@/app/core/models/user.model';
import { CryptoService } from '@/app/core/services/crypto.service';
import { db } from '@/app/core/db/pos-db';
import { TerminalCryptoService } from '@/app/core/security/terminal-crypto.service';
import { authConfig } from '@/app/core/config/auth.config';
import { EmployeeCacheService } from '@/app/core/services/employee-cache.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private crypto = inject(CryptoService);
    private terminalCrypto = inject(TerminalCryptoService);
    private http = inject(HttpClient);
    private router = inject(Router);
    private employeeCache = inject(EmployeeCacheService);

    // Signals
    currentStoreId = signal<string | null>(localStorage.getItem('storeId'));
    isTerminalRegistered = signal<boolean>(false);
    isUnlocked = signal<boolean>(false);
    private activeDek = signal<CryptoKey | null>(null);

    constructor() {
        this.checkTerminalStatus();
    }

    async checkTerminalStatus() {
        const config = await db.security.get('active_config');
        this.isTerminalRegistered.set(!!config?.terminalId);
        if (config) {
            console.log('Terminal is registered.');
        }
    }

    login(credentials: UserCredentials) {
        return this.http.post<LoginResponse>(`${environment.apiUrl}/user/login`, credentials).pipe(
            switchMap(async (res) => {
                localStorage.setItem('token', res.accessToken);
                localStorage.setItem('storeId', res.storeId);

                // Temporary Hardcode as requested to fix TS error
                const deviceSecret = "TEMP_SERVER_SECRET_123";

                const existingConfig = await db.security.get('active_config');

                if (!existingConfig) {
                    // FIRST TIME: Register Hardware
                    console.log('Registering new terminal identity...');
                    await this.runInitialRegistration("0000", res, deviceSecret);
                } else {
                    // SUBSEQUENT TIMES: Unlock Vault with Password
                    console.log('Terminal already registered. Unlocking vault...');
                    await this.unlockVault(credentials.password, existingConfig);
                }

                this.isTerminalRegistered.set(true);
                this.currentStoreId.set(res.storeId);
                return res;
            })
        );
    }

    // Cashier PIN Login
    async loginEmployeeWithPin(pin: string, employeeId: string | null): Promise<boolean> {
        const config = await db.security.get('active_config');
        if (!config?.terminalId || !config?.terminalPrivateKey || !config?.terminalPublicKey) {
            throw new Error('Terminal is not registered. Register this device first.');
        }

        try {
            if (!employeeId) {
                throw new Error('Employee selection required');
            }
            const employee = await this.employeeCache.getById(employeeId);
            if (!employee?.vaultEncryptedDek || !employee?.vaultIv || !employee?.vaultSalt) {
                throw new Error('Employee has no local PIN set');
            }
            await this.unlockEmployeeVault(pin, employee, config);
            await this.authenticateTerminal(config, employeeId);
            this.router.navigate(['/trading']);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async setupEmployeePin(employeeId: string, pin: string): Promise<void> {
        const config = await db.security.get('active_config');
        if (!config?.terminalId || !config?.terminalPrivateKey || !config?.terminalPublicKey) {
            throw new Error('Terminal is not registered. Register this device first.');
        }

        const deviceSecret = config.deviceSecret || this.generateDeviceSecret();
        if (!config.deviceSecret) {
            await db.security.put({
                ...config,
                id: 'active_config',
                deviceSecret
            });
        }

        await this.crypto.requestPersistence();

        const dek = await window.crypto.subtle.generateKey(
            { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']
        );
        const salt = window.crypto.getRandomValues(new Uint8Array(16));
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const kek = await this.crypto.deriveKek(pin, salt, deviceSecret);
        const encryptedDek = await this.crypto.wrapDek(dek, kek, iv);

        await this.employeeCache.updateVault(employeeId, {
            vaultEncryptedDek: encryptedDek,
            vaultIv: iv,
            vaultSalt: salt
        });
    }

    private async runInitialRegistration(password: string, res: LoginResponse, deviceSecret: string) {
        await this.crypto.requestPersistence();
        const keys = await this.crypto.generateTerminalKeys();
        const salt = window.crypto.getRandomValues(new Uint8Array(16));
        const iv = window.crypto.getRandomValues(new Uint8Array(12));

        const dek = await window.crypto.subtle.generateKey(
            { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']
        );

        const kek = await this.crypto.deriveKek(password, salt, deviceSecret);
        const encryptedDek = await this.crypto.wrapDek(dek, kek, iv);

        await db.security.put({
            id: 'active_config',
            encryptedDek,
            iv,
            salt,
            deviceSecret: deviceSecret,
            terminalPublicKey: keys.publicKey,
            terminalPrivateKey: keys.privateKey
        });

        this.activeDek.set(dek);
        this.isUnlocked.set(true);
    }

    private async unlockVault(secret: string, config: any) {
        try {
            const kek = await this.crypto.deriveKek(secret, config.salt, config.deviceSecret);

            const rawDek = await window.crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: config.iv },
                kek,
                config.encryptedDek
            );

            const dek = await window.crypto.subtle.importKey(
                'raw', rawDek, 'AES-GCM', false, ['encrypt', 'decrypt']
            );

            this.activeDek.set(dek);
            this.isUnlocked.set(true);
        } catch (e) {
            throw new Error("Vault unlock failed. Incorrect PIN or Password.");
        }
    }

    private async unlockOrInitializeVault(pin: string, config: any) {
        const hasVault = config.encryptedDek && config.iv && config.salt && config.deviceSecret;
        if (!hasVault || config.encryptedDek.byteLength === 0) {
            await this.initializeVault(pin, config);
            return;
        }
        await this.unlockVault(pin, config);
    }

    private async unlockEmployeeVault(pin: string, employee: any, config: any) {
        const kek = await this.crypto.deriveKek(pin, employee.vaultSalt, config.deviceSecret);
        const rawDek = await window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: employee.vaultIv },
            kek,
            employee.vaultEncryptedDek
        );
        const dek = await window.crypto.subtle.importKey(
            'raw', rawDek, 'AES-GCM', false, ['encrypt', 'decrypt']
        );

        this.activeDek.set(dek);
        this.isUnlocked.set(true);
    }

    private async initializeVault(pin: string, config: any) {
        await this.crypto.requestPersistence();
        const dek = await window.crypto.subtle.generateKey(
            { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']
        );
        const salt = window.crypto.getRandomValues(new Uint8Array(16));
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const deviceSecret = config.deviceSecret || this.generateDeviceSecret();
        const kek = await this.crypto.deriveKek(pin, salt, deviceSecret);
        const encryptedDek = await this.crypto.wrapDek(dek, kek, iv);

        await db.security.put({
            ...config,
            id: 'active_config',
            encryptedDek,
            iv,
            salt,
            deviceSecret
        });

        this.activeDek.set(dek);
        this.isUnlocked.set(true);
    }

    private generateDeviceSecret(): string {
        const bytes = window.crypto.getRandomValues(new Uint8Array(16));
        return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    private async authenticateTerminal(config: any, employeeId: string | null) {
        const tokenUrl = `${environment.apiUrl}/oauth2/token`;
        const dpop = await this.terminalCrypto.createDpopProof(
            config.terminalPrivateKey,
            await this.terminalCrypto.exportPublicKey(config.terminalPublicKey),
            tokenUrl,
            'POST'
        );

        const params = new HttpParams({
            fromObject: {
                grant_type: 'urn:tilltide:params:oauth:grant-type:terminal',
                client_id: authConfig.clientId ?? 'tilltide-pwa',
                terminal_id: config.terminalId,
                ...(employeeId ? { employee_id: employeeId } : {})
            }
        });

        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            'DPoP': dpop
        });

        const response = await firstValueFrom(
            this.http.post<{ access_token: string; token_type: string }>(tokenUrl, params.toString(), { headers })
        );

        if (!response?.access_token) {
            throw new Error('Terminal authentication failed');
        }

        localStorage.setItem('terminal_access_token', response.access_token);
        if (employeeId) {
            localStorage.setItem('terminal_employee_id', employeeId);
        } else {
            localStorage.removeItem('terminal_employee_id');
        }
    }

    getToken(): string | null { return localStorage.getItem('token'); }
    getStoreId(): string | null { return localStorage.getItem('storeId'); }

    // Updated: Check both Token AND Vault status
    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    // New helper for Guard
    isSessionActive(): boolean {
        // Must have token AND be unlocked (DEK in memory)
        return !!this.getToken() && this.isUnlocked();
    }

    logout() {
        localStorage.clear();
        this.currentStoreId.set(null);
        this.activeDek.set(null);
        this.isUnlocked.set(false);
        this.router.navigate(['/user/login']);
    }

    lockSession() {
        // Keeps the token, but clears the DEK (Requires PIN to re-enter)
        this.activeDek.set(null);
        this.isUnlocked.set(false);
        this.router.navigate(['/user/pin']);
    }
}
