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
        return this.base64UrlEncode(signature);
    }

    async createDpopProof(privateKey: CryptoKey, publicJwk: JsonWebKey, htu: string, htm: string): Promise<string> {
        const header = {
            typ: 'dpop+jwt',
            alg: 'ES256',
            jwk: publicJwk
        };
        const payload = {
            htu,
            htm,
            iat: Math.floor(Date.now() / 1000),
            jti: crypto.randomUUID()
        };

        const encodedHeader = this.base64UrlEncode(new TextEncoder().encode(JSON.stringify(header)));
        const encodedPayload = this.base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)));
        const signingInput = `${encodedHeader}.${encodedPayload}`;
        const signature = await crypto.subtle.sign(
            { name: 'ECDSA', hash: 'SHA-256' },
            privateKey,
            new TextEncoder().encode(signingInput)
        );
        const encodedSignature = this.base64UrlEncode(signature);

        return `${signingInput}.${encodedSignature}`;
    }

    private base64UrlEncode(input: ArrayBuffer | Uint8Array): string {
        const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
        const base64 = btoa(String.fromCharCode(...bytes));
        return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    }
}
