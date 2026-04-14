import { Injectable } from '@angular/core';
import { db, TerminalConfig } from '@/app/core/db/pos-db';

@Injectable({ providedIn: 'root' })
export class TerminalStorageService {

    async saveTerminalContext(data: Partial<TerminalConfig>) {
        const existing = await db.security.get('active_config');
        await db.security.put({
            id: 'active_config',
            encryptedDek: existing?.encryptedDek ?? new ArrayBuffer(0),
            iv: existing?.iv ?? new Uint8Array(),
            salt: existing?.salt ?? new Uint8Array(),
            deviceSecret: existing?.deviceSecret ?? '',
            // Always persist freshly provided key material when present.
            terminalPublicKey: (data.terminalPublicKey as CryptoKey) ?? existing?.terminalPublicKey,
            terminalPrivateKey: (data.terminalPrivateKey as CryptoKey) ?? existing?.terminalPrivateKey,
            terminalId: data.terminalId ?? existing?.terminalId,
            workspaceId: data.workspaceId ?? existing?.workspaceId
        });
    }

    async clearTerminalKeys() {
        const existing = await db.security.get('active_config');
        if (!existing) {
            return;
        }

        await db.security.put({
            ...existing,
            id: 'active_config',
            terminalPublicKey: undefined,
            terminalPrivateKey: undefined
        });
    }

    loadTerminalContext() {
        return db.security.get('active_config');
    }

    async clear() {
        await db.security.delete('active_config');
    }
}
