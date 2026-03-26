import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin, finalize } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { AccountContextService } from '@/app/core/services/account-context.service';
import { RoleApiService } from '@/app/core/services/role.api.service';
import { WorkspaceFacade } from '@/app/domains/workspace/data-access/workspace.facade';
import { WorkspaceStore } from '@/app/domains/workspace/data-access/workspace.store';
import { CreateRoleCommand, ManagedRole, RolePermission, UpdateRoleCommand } from '@/app/domains/account/models/roles.model';

@Component({
    selector: 'app-account-roles',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ToastModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        DialogModule,
        MultiSelectModule,
        TabsModule,
        SelectModule
    ],
    providers: [MessageService],
    templateUrl: './roles.component.html'
})
export class RolesComponent implements OnInit {
    private roleApi = inject(RoleApiService);
    private accountContext = inject(AccountContextService);
    private workspaceFacade = inject(WorkspaceFacade);
    protected workspaceStore = inject(WorkspaceStore);
    private messageService = inject(MessageService);

    accountRoles: ManagedRole[] = [];
    workspaceRoles: ManagedRole[] = [];
    accountPermissions: RolePermission[] = [];
    workspacePermissions: RolePermission[] = [];
    accountLoading = false;
    workspaceLoading = false;
    selectedWorkspaceId: string | null = null;

    accountDialogVisible = false;
    workspaceDialogVisible = false;
    accountEditMode = false;
    workspaceEditMode = false;

    accountRoleName = '';
    accountPermissionIds: string[] = [];
    selectedAccountRole: ManagedRole | null = null;

    workspaceRoleName = '';
    workspacePermissionIds: string[] = [];
    selectedWorkspaceRole: ManagedRole | null = null;

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
            return;
        }
        this.loadWorkspaceData(this.selectedWorkspaceId);
    }

    openAccountCreate(): void {
        this.accountEditMode = false;
        this.selectedAccountRole = null;
        this.accountRoleName = '';
        this.accountPermissionIds = [];
        this.accountDialogVisible = true;
    }

    openAccountEdit(role: ManagedRole): void {
        this.accountEditMode = true;
        this.selectedAccountRole = role;
        this.accountRoleName = role.name;
        this.accountPermissionIds = [...role.permissionIds];
        this.accountDialogVisible = true;
    }

    openWorkspaceCreate(): void {
        this.workspaceEditMode = false;
        this.selectedWorkspaceRole = null;
        this.workspaceRoleName = '';
        this.workspacePermissionIds = [];
        this.workspaceDialogVisible = true;
    }

    openWorkspaceEdit(role: ManagedRole): void {
        this.workspaceEditMode = true;
        this.selectedWorkspaceRole = role;
        this.workspaceRoleName = role.name;
        this.workspacePermissionIds = [...role.permissionIds];
        this.workspaceDialogVisible = true;
    }

    saveAccountRole(): void {
        const accountId = this.accountContext.accountId();
        if (!accountId || this.accountPermissionIds.length === 0) return;

        if (this.accountEditMode && this.selectedAccountRole) {
            const command: UpdateRoleCommand = {
                name: this.accountRoleName,
                permissionIds: this.accountPermissionIds
            };
            this.roleApi.updateAccountRole(accountId, this.selectedAccountRole.id, command).subscribe({
                next: () => {
                    this.accountDialogVisible = false;
                    this.loadAccountRoles(accountId);
                },
                error: (error) => this.showError(error, 'Unable to update role.')
            });
            return;
        }

        const command: CreateRoleCommand = {
            name: this.accountRoleName,
            permissionIds: this.accountPermissionIds
        };
        this.roleApi.createAccountRole(accountId, command).subscribe({
            next: () => {
                this.accountDialogVisible = false;
                this.loadAccountRoles(accountId);
            },
            error: (error) => this.showError(error, 'Unable to create role.')
        });
    }

    saveWorkspaceRole(): void {
        if (!this.selectedWorkspaceId || this.workspacePermissionIds.length === 0) return;

        if (this.workspaceEditMode && this.selectedWorkspaceRole) {
            const command: UpdateRoleCommand = {
                name: this.workspaceRoleName,
                permissionIds: this.workspacePermissionIds
            };
            this.roleApi.updateWorkspaceRole(this.selectedWorkspaceId, this.selectedWorkspaceRole.id, command).subscribe({
                next: () => {
                    this.workspaceDialogVisible = false;
                    this.loadWorkspaceRoles(this.selectedWorkspaceId as string);
                },
                error: (error) => this.showError(error, 'Unable to update role.')
            });
            return;
        }

        const command: CreateRoleCommand = {
            name: this.workspaceRoleName,
            permissionIds: this.workspacePermissionIds
        };
        this.roleApi.createWorkspaceRole(this.selectedWorkspaceId, command).subscribe({
            next: () => {
                this.workspaceDialogVisible = false;
                this.loadWorkspaceRoles(this.selectedWorkspaceId as string);
            },
            error: (error) => this.showError(error, 'Unable to create role.')
        });
    }

    private loadAccountData(accountId: string): void {
        this.accountLoading = true;
        forkJoin({
            roles: this.roleApi.getAccountRoles(accountId),
            permissions: this.roleApi.getAccountPermissions()
        })
            .pipe(finalize(() => (this.accountLoading = false)))
            .subscribe({
                next: ({ roles, permissions }) => {
                    this.accountRoles = roles;
                    this.accountPermissions = permissions;
                },
                error: () => {
                    this.messageService.add({ severity: 'error', summary: 'Load failed', detail: 'Unable to load account roles.' });
                }
            });
    }

    private loadWorkspaceData(workspaceId: string): void {
        this.workspaceLoading = true;
        forkJoin({
            roles: this.roleApi.getWorkspaceRoles(workspaceId),
            permissions: this.roleApi.getWorkspacePermissions()
        })
            .pipe(finalize(() => (this.workspaceLoading = false)))
            .subscribe({
                next: ({ roles, permissions }) => {
                    this.workspaceRoles = roles;
                    this.workspacePermissions = permissions;
                },
                error: () => {
                    this.messageService.add({ severity: 'error', summary: 'Load failed', detail: 'Unable to load workspace roles.' });
                }
            });
    }

    private loadAccountRoles(accountId: string): void {
        this.roleApi.getAccountRoles(accountId).subscribe({
            next: (roles) => (this.accountRoles = roles),
            error: () => this.messageService.add({ severity: 'error', summary: 'Load failed', detail: 'Unable to load roles.' })
        });
    }

    private loadWorkspaceRoles(workspaceId: string): void {
        this.roleApi.getWorkspaceRoles(workspaceId).subscribe({
            next: (roles) => (this.workspaceRoles = roles),
            error: () => this.messageService.add({ severity: 'error', summary: 'Load failed', detail: 'Unable to load roles.' })
        });
    }

    private showError(error: any, fallback: string): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Action failed',
            detail: error?.error?.message || fallback
        });
    }
}
