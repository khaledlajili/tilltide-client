export interface AccessRole {
    id: string;
    name: string;
    scopeType: 'ACCOUNT' | 'WORKSPACE';
    scopeId: string;
    systemRole: boolean;
}

export interface AccessMember {
    id: string;
    userId: string;
    email: string;
    fullName: string;
    status: 'ACTIVE' | 'SUSPENDED';
    roleId: string;
    roleName: string;
    scopeType: 'ACCOUNT' | 'WORKSPACE';
    scopeId: string;
    createdAt: string;
}

export interface AccessInvitation {
    id: string;
    email: string;
    scopeType: 'ACCOUNT' | 'WORKSPACE';
    scopeId: string;
    roleId: string;
    roleName: string;
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'REVOKED' | 'EXPIRED';
    expiresAt: string;
    createdBy: string;
    createdAt: string;
}

export interface CreateInvitationCommand {
    email: string;
    roleId: string;
    expiresAt?: string;
}

export interface UpdateMembershipCommand {
    roleId: string;
    status?: 'ACTIVE' | 'SUSPENDED';
}
