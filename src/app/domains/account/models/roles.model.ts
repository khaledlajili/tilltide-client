export interface RolePermission {
    id: string;
    name: string;
    description: string;
}

export interface ManagedRole {
    id: string;
    name: string;
    scopeType: 'ACCOUNT' | 'WORKSPACE';
    scopeId: string;
    systemRole: boolean;
    permissionIds: string[];
}

export interface CreateRoleCommand {
    name: string;
    permissionIds: string[];
}

export interface UpdateRoleCommand {
    name?: string;
    permissionIds: string[];
}
