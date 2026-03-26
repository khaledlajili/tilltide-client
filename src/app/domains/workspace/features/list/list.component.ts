import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

import { WorkspaceFacade } from '../../data-access/workspace.facade';
import { WorkspaceStore } from '../../data-access/workspace.store';
import { AccountContextService } from '@/app/core/services/account-context.service';
import { WorkspaceContextService } from '@/app/core/services/workspace-context.service';
import { WorkspaceProfile } from '../../models/workspace.model';
import { CreateWorkspaceCommand, UpdateWorkspaceCommand } from '../../models/workspace.commands';
import { WorkspaceCreateFormComponent } from '../../ui/create-form/create-form.component';

@Component({
    selector: 'app-workspace-list',
    standalone: true,
    imports: [
        CommonModule,
        DataViewModule,
        CardModule,
        TagModule,
        ButtonModule,
        ToastModule,
        WorkspaceCreateFormComponent
    ],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>

        <div class="card">
            <p-dataView [value]="store.workspaces()" [loading]="store.loading()" layout="grid" styleClass="w-full">
                <ng-template pTemplate="header">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="m-0 text-xl font-semibold">Workspaces</h2>
                            <p class="m-0 text-sm text-muted-color">Manage workspaces for your account.</p>
                        </div>
                        <p-button label="New Workspace" icon="pi pi-plus" (onClick)="openCreate()"></p-button>
                    </div>
                </ng-template>

                <ng-template #grid let-items>
                    <div class="grid grid-cols-12 gap-4">
                        <div *ngFor="let workspace of items" class="col-span-12 sm:col-span-6 lg:col-span-4">
                            <p-card>
                                <ng-template pTemplate="title">{{ workspace.name }}</ng-template>
                                <ng-template pTemplate="subtitle">{{ workspace.schemaName }}</ng-template>

                                <div class="flex items-center gap-2">
                                    <p-tag
                                        [value]="workspace.status"
                                        [severity]="workspace.status === 'ACTIVE' ? 'success' : 'info'">
                                    </p-tag>
                                    <span class="text-sm text-muted-color">{{ workspace.createdAt | date }}</span>
                                </div>

                                <div class="mt-4 flex flex-wrap gap-2">
                                    <p-button
                                        *ngIf="workspaceContext.workspaceId() !== workspace.workspaceId"
                                        label="Select"
                                        icon="pi pi-check"
                                        (onClick)="onSelect(workspace)">
                                    </p-button>

                                    <p-button
                                        *ngIf="workspaceContext.workspaceId() === workspace.workspaceId"
                                        label="Leave"
                                        icon="pi pi-sign-out"
                                        severity="secondary"
                                        (onClick)="onLeaveWorkspace()">
                                    </p-button>

                                    <p-button
                                        label="Edit"
                                        icon="pi pi-pencil"
                                        [text]="true"
                                        (onClick)="openEdit(workspace)">
                                    </p-button>
                                </div>
                            </p-card>
                        </div>
                    </div>
                </ng-template>

                <ng-template pTemplate="empty">
                    <div class="py-6 text-center text-muted-color">
                        No workspaces found.
                    </div>
                </ng-template>
            </p-dataView>
        </div>

        <workspace-create-form
            [(visible)]="createDialog"
            [loading]="creating"
            mode="create"
            [accountId]="accountContext.accountId()"
            (save)="onCreate($event)">
        </workspace-create-form>

        <workspace-create-form
            [(visible)]="editDialog"
            [loading]="editing"
            mode="edit"
            [workspace]="selectedWorkspace"
            (save)="onEdit($event)">
        </workspace-create-form>
    `
})
export class WorkspaceListComponent implements OnInit {
    protected store = inject(WorkspaceStore);
    private facade = inject(WorkspaceFacade);
    protected accountContext = inject(AccountContextService);
    workspaceContext = inject(WorkspaceContextService);
    private messageService = inject(MessageService);
    private router = inject(Router);

    createDialog = false;
    creating = false;
    editDialog = false;
    editing = false;
    selectedWorkspace: WorkspaceProfile | null = null;

    ngOnInit(): void {
        const accountId = this.accountContext.accountId();
        if (accountId) {
            this.facade.loadWorkspaces(accountId).subscribe();
        }
    }

    openCreate(): void {
        this.createDialog = true;
    }

    openEdit(workspace: WorkspaceProfile): void {
        this.selectedWorkspace = workspace;
        this.editDialog = true;
    }

    onSelect(workspace: WorkspaceProfile): void {
        this.workspaceContext.selectWorkspace(workspace.workspaceId, workspace.name).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Workspace selected', detail: workspace.name });
                this.router.navigate(['/trading']);
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Selection failed',
                    detail: error?.error?.message || 'Unable to select workspace.'
                });
            }
        });
    }

    onLeaveWorkspace(): void {
        this.workspaceContext.clearWorkspaceContext();
    }

    onCreate(command: CreateWorkspaceCommand | UpdateWorkspaceCommand): void {
        if (!('accountId' in command)) {
            return;
        }
        this.creating = true;
        this.facade.create(command).subscribe({
            next: () => {
                this.creating = false;
                this.createDialog = false;
            },
            error: (error) => {
                this.creating = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Create failed',
                    detail: error?.error?.message || 'Unable to create workspace.'
                });
            }
        });
    }

    onEdit(command: CreateWorkspaceCommand | UpdateWorkspaceCommand): void {
        if (!('workspaceId' in command)) {
            return;
        }

        const accountId = this.accountContext.accountId();
        if (!accountId) {
            return;
        }

        this.editing = true;
        this.facade.update(command, accountId).subscribe({
            next: () => {
                this.editing = false;
                this.editDialog = false;
            },
            error: (error) => {
                this.editing = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Update failed',
                    detail: error?.error?.message || 'Unable to update workspace.'
                });
            }
        });
    }
}
