import { inject, Injectable } from '@angular/core';
import { EmployeeApiService } from './employee.api.service';
import { CreateEmployeeRequest } from 'src/app/core/models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeRepository {
    private api = inject(EmployeeApiService);

    findAll(workspaceId: string) { return this.api.getAll(workspaceId); }
    create(req: CreateEmployeeRequest) { return this.api.create(req); }
}
