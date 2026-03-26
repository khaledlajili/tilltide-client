export interface Employee {
    id: string;
    name: string;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
}

export interface CreateEmployeeRequest {
    workspaceId: string;
    name: string;
    pin: string;
    roleIds?: string[];
}
