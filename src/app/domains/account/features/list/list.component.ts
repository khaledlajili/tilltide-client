// src/app/domains/account/features/list/list.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

import { AccountContextService } from '@/app/core/services/account-context.service';
import { AccountFacade } from '../../data-access/account.facade';
import { AccountStore } from '../../data-access/account.store';
import { AccountProfile, CreateAccountCommand, UpdateAccountCommand } from '../../models/account.commands';
import { CreateFormComponent } from '../../ui/create-form/create-form.component';

@Component({
    selector: 'app-account-list',
    standalone: true,
    imports: [CommonModule, DataViewModule, CardModule, ButtonModule, TagModule, RouterModule, ToastModule, CreateFormComponent],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>

        <div class="card">
            <p-dataView [value]="store.accounts()" [loading]="store.loading()" [layout]="'grid'">
                <ng-template #header>
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                            <h2 class="m-0 text-xl font-semibold">Select an account</h2>
                            <p class="m-0 text-sm text-muted-color">Choose an account to continue.</p>
                        </div>
                        <p-button label="New Account" icon="pi pi-plus" (onClick)="openCreate()"></p-button>
                    </div>
                </ng-template>

                <ng-template #grid let-items>
                    <div class="grid grid-cols-12 gap-4">
                        <div *ngFor="let account of items" class="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3">
                            <p-card>
                                <ng-template pTemplate="title">{{ account.name }}</ng-template>
                                <ng-template pTemplate="subtitle">{{ account.billingEmail }}</ng-template>

                                <div class="flex items-center gap-2">
                                    <p-tag
                                        [value]="account.status"
                                        [severity]="account.status === 'ACTIVE' ? 'success' : 'info'">
                                    </p-tag>
                                    <span class="text-sm text-muted-color">{{ account.createdAt | date : 'mediumDate' }}</span>
                                </div>

                                <div class="mt-4 flex flex-wrap gap-2">
                                    <p-button
                                        *ngIf="accountContext.accountId() !== account.accountId"
                                        label="Select"
                                        icon="pi pi-check"
                                        (onClick)="onSelect(account)">
                                    </p-button>

                                    <p-button
                                        *ngIf="accountContext.accountId() === account.accountId"
                                        label="Leave"
                                        icon="pi pi-sign-out"
                                        severity="secondary"
                                        (onClick)="onLeaveAccount()">
                                    </p-button>

                                    <p-button
                                        label="Edit"
                                        icon="pi pi-pencil"
                                        [text]="true"
                                        [disabled]="accountContext.accountId() !== account.accountId"
                                        (onClick)="openEdit(account)">
                                    </p-button>
                                </div>
                            </p-card>
                        </div>
                    </div>
                </ng-template>

                <ng-template #empty>
                    <div class="py-6 text-center text-muted-color">
                        No accounts found.
                    </div>
                </ng-template>
            </p-dataView>
        </div>

        <account-create-form
            [(visible)]="createDialog"
            [loading]="creating"
            mode="create"
            (save)="onCreate($event)">
        </account-create-form>

        <account-create-form
            [(visible)]="editDialog"
            [loading]="editing"
            mode="edit"
            [account]="selectedAccount"
            (save)="onEdit($event)">
        </account-create-form>
    `
})
export class AccountListComponent implements OnInit {
    protected store = inject(AccountStore);
    private facade = inject(AccountFacade);
    accountContext = inject(AccountContextService);
    private messageService = inject(MessageService);
    private router = inject(Router);
    createDialog = false;
    creating = false;
    editDialog = false;
    editing = false;
    selectedAccount: AccountProfile | null = null;

    ngOnInit(): void {
        this.facade.loadAccounts().subscribe({
            next: (res) => console.log(res),
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Load Failed',
                    detail: error?.error?.message || 'Unable to load accounts'
                });
            }
        });
    }

    openCreate(): void {
        this.createDialog = true;
    }

    openEdit(account: AccountProfile): void {
        this.selectedAccount = account;
        this.editDialog = true;
    }

    onSelect(account: AccountProfile): void {
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

    onLeaveAccount(): void {
        this.accountContext.clearAccountContext();
    }

    onCreate(command: CreateAccountCommand): void {
        this.creating = true;
        this.facade.register(command).subscribe({
            next: () => {
                this.creating = false;
                this.createDialog = false;
                this.facade.loadAccounts().subscribe();
            },
            error: (error) => {
                this.creating = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Create Failed',
                    detail: error?.error?.message || 'Unable to create account'
                });
            }
        });
    }

    onEdit(command: CreateAccountCommand | UpdateAccountCommand): void {
        if (!('accountId' in command)) {
            return;
        }

        this.editing = true;
        this.facade.update(command).subscribe({
            next: () => {
                this.editing = false;
                this.editDialog = false;
                this.facade.loadAccounts().subscribe();
            },
            error: (error) => {
                this.editing = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Update Failed',
                    detail: error?.error?.message || 'Unable to update account'
                });
            }
        });
    }
}
