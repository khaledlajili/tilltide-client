// src/app/domains/account/features/list/list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { Router, RouterModule } from '@angular/router';
import { AccountFacade } from '../../data-access/account.facade';
import { AccountStore } from '../../data-access/account.store';

@Component({
    selector: 'app-account-list',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, ToolbarModule, TagModule, RouterModule],
    template: `
        <div class="card">
            <p-toolbar styleClass="mb-6">
                <ng-template #start>
                    <p-button label="New Account" icon="pi pi-plus" routerLink="/account/register"></p-button>
                </ng-template>
            </p-toolbar>

            <p-table [value]="store.accounts()" [loading]="store.loading()" [rows]="10" [paginator]="true">
                <ng-template #header>
                    <tr>
                        <th>Company Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th style="width: 5rem"></th>
                    </tr>
                </ng-template>
                <ng-template #body let-account>
                    <tr>
                        <td>{{ account.name }}</td>
                        <td>{{ account.billingEmail }}</td>
                        <td><p-tag [value]="account.status" [severity]="account.status === 'ACTIVE' ? 'success' : 'info'"></p-tag></td>
                        <td>{{ account.createdAt | date }}</td>
                        <td>
                            <p-button icon="pi pi-pencil" [text]="true" [routerLink]="['/account/edit', account.accountId]"></p-button>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `
})
export class AccountListComponent implements OnInit {
    protected store = inject(AccountStore);
    private facade = inject(AccountFacade);

    ngOnInit() {
        this.facade.loadAccounts().subscribe();
    }
}
