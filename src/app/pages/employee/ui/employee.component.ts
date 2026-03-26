import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { EmployeeFacade } from '../employee.facade';
import { EmployeeFormComponent } from './employee-form.component';

@Component({
    selector: 'app-employee',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, ToolbarModule, ToastModule, EmployeeFormComponent],
    providers: [MessageService],
    template: `
<p-toast></p-toast>

<div class="card">
    <p-toolbar class="mb-4">
        <ng-template #start>
            <p-button label="Add Employee" icon="pi pi-plus" (onClick)="openNew()"></p-button>
        </ng-template>
    </p-toolbar>

    <p-table [value]="employees()" [loading]="loading()">
        <ng-template #header>
            <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Created</th>
            </tr>
        </ng-template>
        <ng-template #body let-employee>
            <tr>
                <td>{{ employee.name }}</td>
                <td>{{ employee.status }}</td>
                <td>{{ employee.createdAt }}</td>
            </tr>
        </ng-template>
    </p-table>
</div>

<app-employee-form
    [(visible)]="dialog"
    (save)="register($event)">
</app-employee-form>
`
})
export class EmployeeComponent implements OnInit {

    facade = inject(EmployeeFacade);
    private message = inject(MessageService);

    employees = this.facade.employees;
    loading = this.facade.loading;

    dialog = false;

    ngOnInit(): void {
        this.facade.init();
    }

    openNew(): void {
        this.dialog = true;
    }

    register(data: { name: string }): void {
        this.facade.create(data.name).subscribe(() => {
            this.dialog = false;
            this.message.add({ severity: 'success', summary: 'Employee Created' });
        });
    }
}
