import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CryptoService {
    private readonly ITERATIONS = 100000;

    async generateTerminalKeys(): Promise<CryptoKeyPair> {
        return await window.crypto.subtle.generateKey(
            { name: "ECDSA", namedCurve: "P-256" },
            false,
            ["sign", "verify"]
        );
    }

    async deriveKek(pin: string, salt: Uint8Array, deviceSecret: string): Promise<CryptoKey> {
        const encoder = new TextEncoder();
        const keyMaterial = encoder.encode(pin + deviceSecret).buffer as ArrayBuffer;
        const baseKey = await window.crypto.subtle.importKey(
            'raw',
            keyMaterial,
            'PBKDF2',
            false,
            ['deriveKey']
        );
        return await window.crypto.subtle.deriveKey(
            { name: 'PBKDF2', salt: salt.buffer as ArrayBuffer, iterations: this.ITERATIONS, hash: 'SHA-256' },
            baseKey,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    }

    // Added the missing method
    async wrapDek(dek: CryptoKey, kek: CryptoKey, iv: Uint8Array): Promise<ArrayBuffer> {
        return await window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv.buffer as ArrayBuffer },
            kek,
            await window.crypto.subtle.exportKey('raw', dek)
        );
    }

    async requestPersistence(): Promise<boolean> {
        if (navigator.storage && navigator.storage.persist) {
            return await navigator.storage.persist();
        }
        return false;
    }
}
