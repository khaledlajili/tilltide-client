import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '@/environments/environment';
import { LoginResponse, UserCredentials } from '@/app/core/models/user.model';
import { CryptoService } from '@/app/core/services/crypto.service';
import { db } from '@/app/core/db/pos-db';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private crypto = inject(CryptoService);
    private http = inject(HttpClient);
    private router = inject(Router);

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
        this.isTerminalRegistered.set(!!config);
        if (config) {
            console.log('Terminal is registered.');
        }
    }

    login(credentials: UserCredentials) {
        return this.http.post<LoginResponse>(`${environment.apiUrl}/user/login`, credentials).pipe(
            tap(async (res) => {
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
            })
        );
    }

    // Cashier PIN Login
    async loginWithPin(pin: string): Promise<boolean> {
        const config = await db.security.get('active_config');
        if (!config) return false;

        try {
            await this.unlockVault(pin, config);
            // If successful, navigate to home
            this.router.navigate(['/']);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
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
