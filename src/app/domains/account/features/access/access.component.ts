import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { forkJoin, finalize } from 'rxjs';

import { AccountContextService } from '@/app/core/services/account-context.service';
import { AccessApiService } from '@/app/core/services/access.api.service';
import { WorkspaceFacade } from '@/app/domains/workspace/data-access/workspace.facade';
import { WorkspaceStore } from '@/app/domains/workspace/data-access/workspace.store';
import {
    AccessInvitation,
    AccessMember,
    AccessRole,
    CreateInvitationCommand,
    UpdateMembershipCommand
} from '@/app/domains/account/models/access.model';

@Component({
    selector: 'app-account-access',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ToastModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        DialogModule,
        SelectModule,
        TagModule,
        TabsModule
    ],
    providers: [MessageService],
    templateUrl: './access.component.html'
})
export class AccessComponent implements OnInit {
    private accessApi = inject(AccessApiService);
    private accountContext = inject(AccountContextService);
    private workspaceFacade = inject(WorkspaceFacade);
    protected workspaceStore = inject(WorkspaceStore);
    private messageService = inject(MessageService);

    accountRoles: AccessRole[] = [];
    accountMembers: AccessMember[] = [];
    accountInvitations: AccessInvitation[] = [];
    workspaceRoles: AccessRole[] = [];
    workspaceMembers: AccessMember[] = [];
    workspaceInvitations: AccessInvitation[] = [];

    accountLoading = false;
    workspaceLoading = false;

    selectedWorkspaceId: string | null = null;

    accountInviteVisible = false;
    workspaceInviteVisible = false;

    editMemberVisible = false;
    editWorkspaceMemberVisible = false;

    inviteEmail = '';
    inviteRoleId: string | null = null;

    inviteWorkspaceEmail = '';
    inviteWorkspaceRoleId: string | null = null;

    selectedMember: AccessMember | null = null;
    selectedWorkspaceMember: AccessMember | null = null;

    selectedRoleId: string | null = null;
    selectedStatus: 'ACTIVE' | 'SUSPENDED' = 'ACTIVE';

    selectedWorkspaceRoleId: string | null = null;
    selectedWorkspaceStatus: 'ACTIVE' | 'SUSPENDED' = 'ACTIVE';

    ngOnInit(): void {
        const accountId = this.accountContext.accountId();
        if (accountId) {
            this.loadAccountData(accountId);
            this.workspaceFacade.loadWorkspaces(accountId).subscribe();
        }
    }

    onWorkspaceChange(): void {
        if (!this.selectedWorkspaceId) {
            this.workspaceRoles = [];
            this.workspaceMembers = [];
            this.workspaceInvitations = [];
            return;
        }
        this.loadWorkspaceData(this.selectedWorkspaceId);
    }

    openAccountInvite(): void {
        this.inviteEmail = '';
        this.inviteRoleId = this.accountRoles[0]?.id ?? null;
        this.accountInviteVisible = true;
    }

    openWorkspaceInvite(): void {
        this.inviteWorkspaceEmail = '';
        this.inviteWorkspaceRoleId = this.workspaceRoles[0]?.id ?? null;
        this.workspaceInviteVisible = true;
    }

    openEdit(member: AccessMember): void {
        this.selectedMember = member;
        this.selectedRoleId = member.roleId;
        this.selectedStatus = member.status;
        this.editMemberVisible = true;
    }

    openWorkspaceEdit(member: AccessMember): void {
        this.selectedWorkspaceMember = member;
        this.selectedWorkspaceRoleId = member.roleId;
        this.selectedWorkspaceStatus = member.status;
        this.editWorkspaceMemberVisible = true;
    }

    createAccountInvitation(): void {
        const accountId = this.accountContext.accountId();
        if (!accountId || !this.inviteRoleId) {
            return;
        }

        const command: CreateInvitationCommand = {
            email: this.inviteEmail,
            roleId: this.inviteRoleId
        };

        this.accessApi.createAccountInvitation(accountId, command).subscribe({
            next: () => {
                this.accountInviteVisible = false;
                this.loadAccountInvitations(accountId);
                this.messageService.add({ severity: 'success', summary: 'Invitation sent', detail: 'Invite email sent.' });
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Invite failed',
                    detail: error?.error?.message || 'Unable to send invitation.'
                });
            }
        });
    }

    createWorkspaceInvitation(): void {
        if (!this.selectedWorkspaceId || !this.inviteWorkspaceRoleId) {
            return;
        }

        const command: CreateInvitationCommand = {
            email: this.inviteWorkspaceEmail,
            roleId: this.inviteWorkspaceRoleId
        };

        this.accessApi.createWorkspaceInvitation(this.selectedWorkspaceId, command).subscribe({
            next: () => {
                this.workspaceInviteVisible = false;
                this.loadWorkspaceInvitations(this.selectedWorkspaceId as string);
                this.messageService.add({ severity: 'success', summary: 'Invitation sent', detail: 'Invite email sent.' });
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Invite failed',
                    detail: error?.error?.message || 'Unable to send invitation.'
                });
            }
        });
    }

    updateAccountMember(): void {
        const accountId = this.accountContext.accountId();
        if (!accountId || !this.selectedMember || !this.selectedRoleId) {
            return;
        }

        const command: UpdateMembershipCommand = {
            roleId: this.selectedRoleId,
            status: this.selectedStatus
        };

        this.accessApi.updateAccountMembership(accountId, this.selectedMember.id, command).subscribe({
            next: () => {
                this.editMemberVisible = false;
                this.loadAccountMembers(accountId);
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Update failed',
                    detail: error?.error?.message || 'Unable to update membership.'
                });
            }
        });
    }

    updateWorkspaceMember(): void {
        if (!this.selectedWorkspaceId || !this.selectedWorkspaceMember || !this.selectedWorkspaceRoleId) {
            return;
        }

        const command: UpdateMembershipCommand = {
            roleId: this.selectedWorkspaceRoleId,
            status: this.selectedWorkspaceStatus
        };

        this.accessApi.updateWorkspaceMembership(this.selectedWorkspaceId, this.selectedWorkspaceMember.id, command).subscribe({
            next: () => {
                this.editWorkspaceMemberVisible = false;
                this.loadWorkspaceMembers(this.selectedWorkspaceId as string);
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Update failed',
                    detail: error?.error?.message || 'Unable to update membership.'
                });
            }
        });
    }

    revokeAccountInvitation(invitation: AccessInvitation): void {
        const accountId = this.accountContext.accountId();
        if (!accountId) {
            return;
        }
        this.accessApi.revokeAccountInvitation(accountId, invitation.id).subscribe({
            next: () => this.loadAccountInvitations(accountId),
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Revoke failed',
                    detail: error?.error?.message || 'Unable to revoke invitation.'
                });
            }
        });
    }

    revokeWorkspaceInvitation(invitation: AccessInvitation): void {
        if (!this.selectedWorkspaceId) {
            return;
        }
        this.accessApi.revokeWorkspaceInvitation(this.selectedWorkspaceId, invitation.id).subscribe({
            next: () => this.loadWorkspaceInvitations(this.selectedWorkspaceId as string),
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Revoke failed',
                    detail: error?.error?.message || 'Unable to revoke invitation.'
                });
            }
        });
    }

    private loadAccountData(accountId: string): void {
        this.accountLoading = true;
        forkJoin({
            roles: this.accessApi.getAccountRoles(accountId),
            members: this.accessApi.getAccountMemberships(accountId),
            invitations: this.accessApi.getAccountInvitations(accountId)
        })
            .pipe(finalize(() => (this.accountLoading = false)))
            .subscribe({
                next: ({ roles, members, invitations }) => {
                    this.accountRoles = roles;
                    this.accountMembers = members;
                    this.accountInvitations = invitations;
                },
                error: () => {
                    this.messageService.add({ severity: 'error', summary: 'Load failed', detail: 'Unable to load account access data.' });
                }
            });
    }

    private loadWorkspaceData(workspaceId: string): void {
        this.workspaceLoading = true;
        forkJoin({
            roles: this.accessApi.getWorkspaceRoles(workspaceId),
            members: this.accessApi.getWorkspaceMemberships(workspaceId),
            invitations: this.accessApi.getWorkspaceInvitations(workspaceId)
        })
            .pipe(finalize(() => (this.workspaceLoading = false)))
            .subscribe({
                next: ({ roles, members, invitations }) => {
                    this.workspaceRoles = roles;
                    this.workspaceMembers = members;
                    this.workspaceInvitations = invitations;
                },
                error: () => {
                    this.messageService.add({ severity: 'error', summary: 'Load failed', detail: 'Unable to load workspace access data.' });
                }
            });
    }

    private loadAccountInvitations(accountId: string): void {
        this.accessApi.getAccountInvitations(accountId).subscribe({
            next: (invitations) => (this.accountInvitations = invitations),
            error: () => this.messageService.add({ severity: 'error', summary: 'Load failed', detail: 'Unable to load invitations.' })
        });
    }

    private loadWorkspaceInvitations(workspaceId: string): void {
        this.accessApi.getWorkspaceInvitations(workspaceId).subscribe({
            next: (invitations) => (this.workspaceInvitations = invitations),
            error: () => this.messageService.add({ severity: 'error', summary: 'Load failed', detail: 'Unable to load invitations.' })
        });
    }

    private loadAccountMembers(accountId: string): void {
        this.accessApi.getAccountMemberships(accountId).subscribe({
            next: (members) => (this.accountMembers = members),
            error: () => this.messageService.add({ severity: 'error', summary: 'Load failed', detail: 'Unable to load members.' })
        });
    }

    private loadWorkspaceMembers(workspaceId: string): void {
        this.accessApi.getWorkspaceMemberships(workspaceId).subscribe({
            next: (members) => (this.workspaceMembers = members),
            error: () => this.messageService.add({ severity: 'error', summary: 'Load failed', detail: 'Unable to load members.' })
        });
    }
}
