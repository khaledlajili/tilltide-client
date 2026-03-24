import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';
import {
    AccessInvitation,
    AccessMember,
    AccessRole,
    CreateInvitationCommand,
    UpdateMembershipCommand
} from '@/app/domains/account/models/access.model';

@Injectable({ providedIn: 'root' })
export class AccessApiService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/api`;

    getAccountRoles(accountId: string) {
        return this.http.get<AccessRole[]>(`${this.baseUrl}/access/accounts/${accountId}/roles`);
    }

    getWorkspaceRoles(workspaceId: string) {
        return this.http.get<AccessRole[]>(`${this.baseUrl}/access/workspaces/${workspaceId}/roles`);
    }

    getAccountMemberships(accountId: string) {
        return this.http.get<AccessMember[]>(`${this.baseUrl}/access/accounts/${accountId}/memberships`);
    }

    getWorkspaceMemberships(workspaceId: string) {
        return this.http.get<AccessMember[]>(`${this.baseUrl}/access/workspaces/${workspaceId}/memberships`);
    }

    updateAccountMembership(accountId: string, membershipId: string, command: UpdateMembershipCommand) {
        return this.http.put<AccessMember>(`${this.baseUrl}/access/accounts/${accountId}/memberships/${membershipId}`, command);
    }

    updateWorkspaceMembership(workspaceId: string, membershipId: string, command: UpdateMembershipCommand) {
        return this.http.put<AccessMember>(`${this.baseUrl}/access/workspaces/${workspaceId}/memberships/${membershipId}`, command);
    }

    getAccountInvitations(accountId: string) {
        return this.http.get<AccessInvitation[]>(`${this.baseUrl}/access/accounts/${accountId}/invitations`);
    }

    getWorkspaceInvitations(workspaceId: string) {
        return this.http.get<AccessInvitation[]>(`${this.baseUrl}/access/workspaces/${workspaceId}/invitations`);
    }

    createAccountInvitation(accountId: string, command: CreateInvitationCommand) {
        return this.http.post<AccessInvitation>(`${this.baseUrl}/access/accounts/${accountId}/invitations`, command);
    }

    createWorkspaceInvitation(workspaceId: string, command: CreateInvitationCommand) {
        return this.http.post<AccessInvitation>(`${this.baseUrl}/access/workspaces/${workspaceId}/invitations`, command);
    }

    revokeAccountInvitation(accountId: string, invitationId: string) {
        return this.http.post<AccessInvitation>(`${this.baseUrl}/access/accounts/${accountId}/invitations/${invitationId}/revoke`, {});
    }

    revokeWorkspaceInvitation(workspaceId: string, invitationId: string) {
        return this.http.post<AccessInvitation>(`${this.baseUrl}/access/workspaces/${workspaceId}/invitations/${invitationId}/revoke`, {});
    }

    getMyInvitations() {
        return this.http.get<AccessInvitation[]>(`${this.baseUrl}/invitations/me`);
    }

    acceptInvitation(token: string) {
        return this.http.post<AccessInvitation>(`${this.baseUrl}/invitations/accept?token=${encodeURIComponent(token)}`, {});
    }

    declineInvitation(token: string) {
        return this.http.post<AccessInvitation>(`${this.baseUrl}/invitations/decline?token=${encodeURIComponent(token)}`, {});
    }

    acceptInvitationById(invitationId: string) {
        return this.http.post<AccessInvitation>(`${this.baseUrl}/invitations/${invitationId}/accept`, {});
    }

    declineInvitationById(invitationId: string) {
        return this.http.post<AccessInvitation>(`${this.baseUrl}/invitations/${invitationId}/decline`, {});
    }
}
