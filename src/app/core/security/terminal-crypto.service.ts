import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TerminalCryptoService {

    async generateKeyPair(): Promise<CryptoKeyPair> {
        return crypto.subtle.generateKey(
            {
                name: 'ECDSA',
                namedCurve: 'P-256'
            },
            true,
            ['sign', 'verify']
        );
    }

    async exportPublicKey(publicKey: CryptoKey): Promise<JsonWebKey> {
        return crypto.subtle.exportKey('jwk', publicKey);
    }

    async sign(privateKey: CryptoKey, data: string): Promise<string> {
        const encoded = new TextEncoder().encode(data);
        const signature = await crypto.subtle.sign(
            { name: 'ECDSA', hash: 'SHA-256' },
            privateKey,
            encoded
        );
        return btoa(String.fromCharCode(...new Uint8Array(signature)));
    }
}
