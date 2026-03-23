import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { WorkspaceFacade } from '../../data-access/workspace.facade';
import { WorkspaceStore } from '../../data-access/workspace.store';
import { AccountContextService } from '@/app/core/services/account-context.service';

@Component({
    selector: 'app-workspace-list',
    standalone: true,
    imports: [CommonModule, DataViewModule, CardModule, TagModule],
    template: `
        <div class="card">
            <p-dataView [value]="store.workspaces()" [loading]="store.loading()" layout="grid">
                <ng-template pTemplate="header">
                    <div>
                        <h2 class="m-0 text-xl font-semibold">Workspaces</h2>
                        <p class="m-0 text-sm text-muted-color">Manage workspaces for your account.</p>
                    </div>
                </ng-template>
                <ng-template pTemplate="grid" let-workspace>
                    <div class="col-12 sm:col-6 lg:col-4">
                        <p-card>
                            <ng-template pTemplate="title">{{ workspace.name }}</ng-template>
                            <ng-template pTemplate="subtitle">{{ workspace.schemaName }}</ng-template>
                            <div class="flex items-center gap-2">
                                <p-tag [value]="workspace.status" [severity]="workspace.status === 'ACTIVE' ? 'success' : 'info'"></p-tag>
                                <span class="text-sm text-muted-color">{{ workspace.createdAt | date }}</span>
                            </div>
                        </p-card>
                    </div>
                </ng-template>
            </p-dataView>
        </div>
    `
})
export class WorkspaceListComponent implements OnInit {
    protected store = inject(WorkspaceStore);
    private facade = inject(WorkspaceFacade);
    private accountContext = inject(AccountContextService);

    ngOnInit() {
        const accountId = this.accountContext.accountId();
        if (accountId) {
            this.facade.loadWorkspaces(accountId).subscribe();
        }
    }
}
