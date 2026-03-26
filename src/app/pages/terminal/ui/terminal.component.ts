import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TerminalFacade } from './../terminal.facade';
import { TerminalFormComponent } from './terminal-form.component';

@Component({
    selector: 'app-terminal',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, ToolbarModule, ToastModule, TerminalFormComponent],
    providers: [MessageService],
    template: `
<p-toast></p-toast>

<div class="card">
    <p-toolbar class="mb-4">
        <ng-template #start>
            <p-button label="Register This Device" icon="pi pi-plus" (onClick)="openNew()"></p-button>
        </ng-template>
    </p-toolbar>

    <p-table [value]="terminals()" [loading]="loading()">
        <ng-template #header>
            <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Actions</th>
            </tr>
        </ng-template>
        <ng-template #body let-terminal>
            <tr>
                <td>{{ terminal.label }}</td>
                <td>{{ terminal.status }}</td>
                <td>{{ terminal.createdAt }}</td>
                <td>
                    <p-button icon="pi pi-ban" severity="warning" [text]="true" (click)="revoke(terminal.id)"></p-button>
                </td>
            </tr>
        </ng-template>
    </p-table>
</div>

<app-terminal-form
    [(visible)]="dialog"
    (save)="register($event)">
</app-terminal-form>
`
})
export class TerminalComponent implements OnInit {

    facade = inject(TerminalFacade);
    private message = inject(MessageService);

    terminals = this.facade.terminals;
    loading = this.facade.loading;

    dialog = false;

    ngOnInit() {
        this.facade.init();
    }

    openNew() {
        this.dialog = true;
    }

    register(data: any) {
        this.facade.register(data.label).subscribe(() => {
            this.dialog = false;
            this.message.add({ severity: 'success', summary: 'Terminal Registered' });
        });
    }

    revoke(id: string) {
        this.facade.revoke(id).subscribe(() => {
            this.message.add({ severity: 'info', summary: 'Terminal Revoked' });
        });
    }
}
