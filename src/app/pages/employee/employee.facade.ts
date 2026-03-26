import { inject, Injectable } from '@angular/core';
import { EmployeeStore } from './state/employee.store';
import { EmployeeRepository } from './data/employee.repository';
import { WorkspaceContextService } from 'src/app/core/services/workspace-context.service';
import { CreateEmployeeRequest, Employee } from 'src/app/core/models/employee.model';
import { tap } from 'rxjs';
import { EmployeeCacheService } from 'src/app/core/services/employee-cache.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable({ providedIn: 'root' })
export class EmployeeFacade {

    private store = inject(EmployeeStore);
    private repo = inject(EmployeeRepository);
    private workspaceContext = inject(WorkspaceContextService);
    private cache = inject(EmployeeCacheService);
    private auth = inject(AuthService);

    employees = this.store.entities;
    loading = this.store.loading;

    init() {
        const workspaceId = this.workspaceContext.workspaceId();
        if (workspaceId) {
            this.store.loadAll(workspaceId);
            this.repo.findAll(workspaceId).subscribe({
                next: (employees: Employee[]) => this.cache.upsertMany(employees)
            });
        }
    }

    create(name: string, pin: string) {
        const workspaceId = this.workspaceContext.workspaceId();
        if (!workspaceId) {
            throw new Error('Missing workspace context');
        }

        const request: CreateEmployeeRequest = {
            workspaceId,
            name
        };

        return this.repo.create(request).pipe(
            tap(async (employee: Employee) => {
                this.store.addEmployee(employee);
                await this.cache.upsertOne(employee);
                await this.auth.setupEmployeePin(employee.id, pin);
            })
        );
    }
}
