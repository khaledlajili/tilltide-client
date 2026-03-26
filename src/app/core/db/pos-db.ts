import Dexie, { Table } from 'dexie';

export interface TerminalConfig {
    id: string; // 'active_config'
    encryptedDek: ArrayBuffer;
    iv: Uint8Array;
    salt: Uint8Array;
    deviceSecret: string;
    terminalPublicKey: CryptoKey;
    terminalPrivateKey: CryptoKey; // Stored as non-exportable object
    terminalId?: string;
    workspaceId?: string;
}

export interface CachedEmployee {
    id: string;
    name: string;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
    vaultEncryptedDek?: ArrayBuffer;
    vaultIv?: Uint8Array;
    vaultSalt?: Uint8Array;
}

export class PosDb extends Dexie {
    security!: Table<TerminalConfig>;
    employees!: Table<CachedEmployee>;

    constructor() {
        super('PosDatabase');
        this.version(1).stores({
            security: 'id'
        });
        this.version(2).stores({
            security: 'id',
            employees: 'id'
        });
    }
}

export const db = new PosDb();
