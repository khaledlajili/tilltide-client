export interface Terminal {
    id: string;
    workspaceId: string;
    label: string;
    status: 'ACTIVE' | 'REVOKED';
    createdAt: string;
    lastSeenAt?: string;
}

export interface RegisterTerminalRequest {
    workspaceId: string;
    label: string;
    publicKey: JsonWebKey;
}
