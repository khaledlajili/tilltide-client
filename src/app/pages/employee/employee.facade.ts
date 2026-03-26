import { inject, Injectable } from '@angular/core';
import { EmployeeStore } from './state/employee.store';
import { EmployeeRepository } from './data/employee.repository';
import { WorkspaceContextService } from 'src/app/core/services/workspace-context.service';
import { CreateEmployeeRequest } from 'src/app/core/models/employee.model';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmployeeFacade {

    private store = inject(EmployeeStore);
    private repo = inject(EmployeeRepository);
    private workspaceContext = inject(WorkspaceContextService);

    employees = this.store.entities;
    loading = this.store.loading;

    init() {
        const workspaceId = this.workspaceContext.workspaceId();
        if (workspaceId) {
            this.store.loadAll(workspaceId);
        }
    }

    create(name: string, pin: string) {
        const workspaceId = this.workspaceContext.workspaceId();
        if (!workspaceId) {
            throw new Error('Missing workspace context');
        }

        const request: CreateEmployeeRequest = {
            workspaceId,
            name,
            pin
        };

        return this.repo.create(request).pipe(
            tap(employee => this.store.addEmployee(employee))
        );
    }
}
