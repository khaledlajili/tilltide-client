import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { CreateRoleCommand, ManagedRole, RolePermission, UpdateRoleCommand } from '@/app/domains/account/models/roles.model';

@Injectable({ providedIn: 'root' })
export class RoleApiService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/api/roles`;

    getAccountRoles(accountId: string) {
        return this.http.get<ManagedRole[]>(`${this.baseUrl}/accounts/${accountId}`);
    }

    getWorkspaceRoles(workspaceId: string) {
        return this.http.get<ManagedRole[]>(`${this.baseUrl}/workspaces/${workspaceId}`);
    }

    getAccountPermissions() {
        return this.http.get<RolePermission[]>(`${this.baseUrl}/permissions/account`);
    }

    getWorkspacePermissions() {
        return this.http.get<RolePermission[]>(`${this.baseUrl}/permissions/workspace`);
    }

    createAccountRole(accountId: string, command: CreateRoleCommand) {
        return this.http.post<ManagedRole>(`${this.baseUrl}/accounts/${accountId}`, command);
    }

    createWorkspaceRole(workspaceId: string, command: CreateRoleCommand) {
        return this.http.post<ManagedRole>(`${this.baseUrl}/workspaces/${workspaceId}`, command);
    }

    updateAccountRole(accountId: string, roleId: string, command: UpdateRoleCommand) {
        return this.http.put<ManagedRole>(`${this.baseUrl}/accounts/${accountId}/${roleId}`, command);
    }

    updateWorkspaceRole(workspaceId: string, roleId: string, command: UpdateRoleCommand) {
        return this.http.put<ManagedRole>(`${this.baseUrl}/workspaces/${workspaceId}/${roleId}`, command);
    }
}
