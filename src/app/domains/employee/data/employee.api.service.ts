import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CreateEmployeeRequest, Employee } from 'src/app/core/models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeApiService {
    private http = inject(HttpClient);
    private url = `${environment.apiUrl}/api/employees`;

    getAll(workspaceId: string) {
        return this.http.get<Employee[]>(this.url, { params: { workspaceId } });
    }

    create(req: CreateEmployeeRequest) {
        return this.http.post<Employee>(this.url, req);
    }
}
