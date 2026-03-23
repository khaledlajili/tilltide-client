// src/app/domains/account/features/list/list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { RouterModule, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AccountFacade } from '../../data-access/account.facade';
import { AccountStore } from '../../data-access/account.store';
import { AccountContextService } from '@/app/core/services/account-context.service';
import { AccountProfile } from '../../models/account.commands';

@Component({
    selector: 'app-account-list',
    standalone: true,
    imports: [CommonModule, DataViewModule, CardModule, ButtonModule, TagModule, RouterModule, ToastModule],
    providers: [MessageService],
    template: `
        <p-toast />
        <div class="card">
            <p-dataView [value]="store.accounts()" [loading]="store.loading()" layout="grid">
                <ng-template pTemplate="header">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                            <h2 class="m-0 text-xl font-semibold">Select an account</h2>
                            <p class="m-0 text-sm text-muted-color">Choose an account to continue.</p>
                        </div>
                        <p-button label="New Account" icon="pi pi-plus" routerLink="/account/register"></p-button>
                    </div>
                </ng-template>
                <ng-template pTemplate="grid" let-account>
                    <div class="col-12 sm:col-6 lg:col-4">
                        <p-card>
                            <ng-template pTemplate="title">{{ account.name }}</ng-template>
                            <ng-template pTemplate="subtitle">{{ account.billingEmail }}</ng-template>
                            <div class="flex items-center gap-2">
                                <p-tag [value]="account.status" [severity]="account.status === 'ACTIVE' ? 'success' : 'info'"></p-tag>
                                <span class="text-sm text-muted-color">{{ account.createdAt | date }}</span>
                            </div>
                            <div class="mt-4 flex flex-wrap gap-2">
                                <p-button label="Select" icon="pi pi-check" (onClick)="onSelect(account)"></p-button>
                                <p-button label="Edit" icon="pi pi-pencil" [text]="true" [routerLink]="['/account/edit', account.accountId]" [disabled]="accountContext.accountId() !== account.accountId"></p-button>
                            </div>
                        </p-card>
                    </div>
                </ng-template>
                <ng-template pTemplate="gridItem" let-account>
                    <div class="col-12 sm:col-6 lg:col-4">
                        <p-card>
                            <ng-template pTemplate="title">{{ account.name }}</ng-template>
                            <ng-template pTemplate="subtitle">{{ account.billingEmail }}</ng-template>
                            <div class="flex items-center gap-2">
                                <p-tag [value]="account.status" [severity]="account.status === 'ACTIVE' ? 'success' : 'info'"></p-tag>
                                <span class="text-sm text-muted-color">{{ account.createdAt | date }}</span>
                            </div>
                            <div class="mt-4 flex flex-wrap gap-2">
                                <p-button label="Select" icon="pi pi-check" (onClick)="onSelect(account)"></p-button>
                                <p-button label="Edit" icon="pi pi-pencil" [text]="true" [routerLink]="['/account/edit', account.accountId]" [disabled]="accountContext.accountId() !== account.accountId"></p-button>
                            </div>
                        </p-card>
                    </div>
                </ng-template>
            </p-dataView>
        </div>
    `
})
export class AccountListComponent implements OnInit {
    protected store = inject(AccountStore);
    private facade = inject(AccountFacade);
    accountContext = inject(AccountContextService);
    private messageService = inject(MessageService);
    private router = inject(Router);

    ngOnInit() {
        this.facade.loadAccounts().subscribe();
    }

    onSelect(account: AccountProfile) {
        this.accountContext.selectAccount(account.accountId, account.name).subscribe({
            next: () => this.router.navigate(['/workspace/list']),
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Selection Failed',
                    detail: error?.error?.message || 'Unable to select account'
                });
            }
        });
    }
}
