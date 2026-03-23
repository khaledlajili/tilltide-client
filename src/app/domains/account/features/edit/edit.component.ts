// src/app/domains/account/features/edit/edit.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { AccountFacade } from '../../data-access/account.facade';
import { EditFormComponent } from '../../ui/edit-form/edit-form.component';
import { UpdateAccountCommand } from '../../models/account.commands';
import { AccountStore } from '../../data-access/account.store';

@Component({
    selector: 'app-account-edit',
    standalone: true,
    imports: [CommonModule, ButtonModule, ToastModule, CardModule, EditFormComponent],
    providers: [MessageService],
    templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {
    private accountFacade = inject(AccountFacade);
    protected store = inject(AccountStore);
    private messageService = inject(MessageService);
    private route = inject(ActivatedRoute);

    loading = false;
    isEditing = false;

    ngOnInit() {
        // In a real app, get this ID from your AuthFacade or route params
        const id = this.route.snapshot.paramMap.get('id');

        if (id) {
            this.accountFacade.loadProfile(id).subscribe({
                error: () =>
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Could not load profile'
                    })
            });
        }
    }

    onUpdate(command: UpdateAccountCommand) {
        this.loading = true;
        this.accountFacade.update(command).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Account updated successfully!',
                });
                this.isEditing = false;
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
