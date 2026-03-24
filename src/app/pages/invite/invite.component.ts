import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { AccessApiService } from '@/app/core/services/access.api.service';

@Component({
    selector: 'app-invite',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, ToastModule],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>
        <div class="flex items-center justify-center min-h-screen">
            <div class="card w-full max-w-lg">
                <h2 class="m-0 text-xl font-semibold">Invitation</h2>
                <p class="text-muted-color">Use the buttons below to accept or decline the invitation.</p>

                <div *ngIf="!token" class="text-muted-color">Invalid or missing invitation token.</div>

                <div *ngIf="token" class="flex gap-2 mt-4">
                    <p-button label="Accept" icon="pi pi-check" (onClick)="accept()"></p-button>
                    <p-button label="Decline" icon="pi pi-times" severity="secondary" [text]="true" (onClick)="decline()"></p-button>
                </div>

                <div *ngIf="registrationRequired" class="mt-4">
                    <p class="text-muted-color">You need to register before accepting this invitation.</p>
                    <a routerLink="/user/register" class="text-primary">Go to registration</a>
                </div>
            </div>
        </div>
    `
})
export class InviteComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private accessApi = inject(AccessApiService);
    private messageService = inject(MessageService);

    token: string | null = null;
    registrationRequired = false;

    ngOnInit(): void {
        this.token = this.route.snapshot.queryParamMap.get('token');
    }

    accept(): void {
        if (!this.token) {
            return;
        }
        this.registrationRequired = false;
        this.accessApi.acceptInvitation(this.token).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Accepted', detail: 'Invitation accepted.' });
            },
            error: (error) => {
                const message = error?.error?.message || 'Unable to accept invitation.';
                if (message === 'USER_REGISTRATION_REQUIRED') {
                    this.registrationRequired = true;
                    return;
                }
                this.messageService.add({ severity: 'error', summary: 'Accept failed', detail: message });
            }
        });
    }

    decline(): void {
        if (!this.token) {
            return;
        }
        this.registrationRequired = false;
        this.accessApi.declineInvitation(this.token).subscribe({
            next: () => {
                this.messageService.add({ severity: 'info', summary: 'Declined', detail: 'Invitation declined.' });
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Decline failed', detail: error?.error?.message || 'Unable to decline invitation.' });
            }
        });
    }
}
