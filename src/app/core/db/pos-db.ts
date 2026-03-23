import Dexie, { Table } from 'dexie';

export interface TerminalConfig {
    id: string; // 'active_config'
    encryptedDek: ArrayBuffer;
    iv: Uint8Array;
    salt: Uint8Array;
    deviceSecret: string;
    terminalPublicKey: CryptoKey;
    terminalPrivateKey: CryptoKey; // Stored as non-exportable object
}

export class PosDb extends Dexie {
    security!: Table<TerminalConfig>;

    constructor() {
        super('PosDatabase');
        this.version(1).stores({
            security: 'id'
        });
    }
}

export const db = new PosDb();
