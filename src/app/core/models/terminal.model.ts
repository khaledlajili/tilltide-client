export interface Terminal {
    id: string;
    name: string;
    location?: string;
    status: 'ACTIVE' | 'REVOKED';
    registeredAt: string;
    lastSeen?: string;
}

export interface RegisterTerminalRequest {
    name: string;
    location?: string;
    publicKey: string;
    deviceFingerprint: string;
}
