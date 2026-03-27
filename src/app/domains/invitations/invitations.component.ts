import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { AccessApiService } from '@/app/core/services/access.api.service';
import { AccessInvitation } from '@/app/domains/account/models/access.model';

@Component({
    selector: 'app-invitations',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, TagModule, ToastModule],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>
        <div class="card">
            <div class="flex items-center justify-between mb-3">
                <div>
                    <h2 class="m-0 text-xl font-semibold">Your invitations</h2>
                    <p class="m-0 text-sm text-muted-color">Accept or decline invitations to accounts and workspaces.</p>
                </div>
            </div>

            <p-table [value]="invitations" dataKey="id">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Scope</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Expires</th>
                        <th></th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-invite>
                    <tr>
                        <td>{{ invite.scopeType }}</td>
                        <td>{{ invite.roleName }}</td>
                        <td>
                            <p-tag [value]="invite.status" [severity]="invite.status === 'PENDING' ? 'info' : 'secondary'"></p-tag>
                        </td>
                        <td>{{ invite.expiresAt | date: 'mediumDate' }}</td>
                        <td class="text-right">
                            <p-button
                                *ngIf="invite.status === 'PENDING'"
                                label="Accept"
                                icon="pi pi-check"
                                (onClick)="accept(invite)">
                            </p-button>
                            <p-button
                                *ngIf="invite.status === 'PENDING'"
                                label="Decline"
                                icon="pi pi-times"
                                severity="secondary"
                                [text]="true"
                                (onClick)="decline(invite)">
                            </p-button>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="empty">
                    <tr>
                        <td colspan="5" class="text-center text-muted-color">No invitations found.</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `
})
export class InvitationsComponent implements OnInit {
    private accessApi = inject(AccessApiService);
    private messageService = inject(MessageService);

    invitations: AccessInvitation[] = [];

    ngOnInit(): void {
        this.loadInvitations();
    }

    accept(invite: AccessInvitation): void {
        this.accessApi.acceptInvitationById(invite.id).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Accepted', detail: 'Invitation accepted.' });
                this.loadInvitations();
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Accept failed',
                    detail: error?.error?.message || 'Unable to accept invitation.'
                });
            }
        });
    }

    decline(invite: AccessInvitation): void {
        this.accessApi.declineInvitationById(invite.id).subscribe({
            next: () => {
                this.messageService.add({ severity: 'info', summary: 'Declined', detail: 'Invitation declined.' });
                this.loadInvitations();
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Decline failed',
                    detail: error?.error?.message || 'Unable to decline invitation.'
                });
            }
        });
    }

    private loadInvitations(): void {
        this.accessApi.getMyInvitations().subscribe({
            next: (invitations) => (this.invitations = invitations),
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Load failed', detail: 'Unable to load invitations.' });
            }
        });
    }
}
