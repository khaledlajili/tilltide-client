// src/app/domains/account/features/edit/edit.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AccountFacade } from '../../data-access/account.facade';
import { CreateFormComponent } from '../../ui/create-form/create-form.component';
import { AccountProfile, CreateAccountCommand, UpdateAccountCommand } from '../../models/account.commands';
import { AccountStore } from '../../data-access/account.store';

@Component({
    selector: 'app-account-edit',
    standalone: true,
    imports: [CommonModule, ToastModule, CreateFormComponent],
    providers: [MessageService],
    templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {
    private accountFacade = inject(AccountFacade);
    protected store = inject(AccountStore);
    private messageService = inject(MessageService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    loading = false;
    visible = true;
    account: AccountProfile | null = null;

    ngOnInit() {
        // In a real app, get this ID from your AuthFacade or route params
        const id = this.route.snapshot.paramMap.get('id');

        if (id) {
            this.accountFacade.loadProfile(id).subscribe({
                next: () => {
                    this.account = this.store.profile();
                },
                error: () =>
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Could not load profile'
                    })
            });
        }
    }

    onCancel() {
        this.router.navigate(['/account/list']);
    }

    onUpdate(command: CreateAccountCommand | UpdateAccountCommand) {
        if (!('accountId' in command)) {
            return;
        }
        this.loading = true;
        this.accountFacade.update(command).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Account updated successfully!',
                });
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Update Failed',
                    detail: err.error?.message || 'Update failed'
                });
            },
        });
    }
}
