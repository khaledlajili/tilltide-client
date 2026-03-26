import { Injectable } from '@angular/core';
import { db, CachedEmployee } from '@/app/core/db/pos-db';
import { Employee } from '@/app/core/models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeCacheService {

    async getAll(): Promise<CachedEmployee[]> {
        return db.employees.toArray();
    }

    async upsertMany(employees: Employee[]): Promise<void> {
        const records: CachedEmployee[] = employees.map(employee => ({
            id: employee.id,
            name: employee.name,
            status: employee.status,
            createdAt: employee.createdAt
        }));
        await db.employees.bulkPut(records);
    }

    async upsertOne(employee: Employee): Promise<void> {
        await db.employees.put({
            id: employee.id,
            name: employee.name,
            status: employee.status,
            createdAt: employee.createdAt
        });
    }
}
