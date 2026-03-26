import { Injectable } from '@angular/core';
import { db, CachedEmployee } from '@/app/core/db/pos-db';
import { Employee } from '@/app/core/models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeCacheService {

    async getById(id: string): Promise<CachedEmployee | undefined> {
        return db.employees.get(id);
    }

    async getAll(): Promise<CachedEmployee[]> {
        return db.employees.toArray();
    }

    async upsertMany(employees: Employee[]): Promise<void> {
        const records: CachedEmployee[] = [];
        for (const employee of employees) {
            const existing = await db.employees.get(employee.id);
            records.push({
                id: employee.id,
                name: employee.name,
                status: employee.status,
                createdAt: employee.createdAt,
                vaultEncryptedDek: existing?.vaultEncryptedDek,
                vaultIv: existing?.vaultIv,
                vaultSalt: existing?.vaultSalt
            });
        }
        await db.employees.bulkPut(records);
    }

    async upsertOne(employee: Employee): Promise<void> {
        const existing = await db.employees.get(employee.id);
        await db.employees.put({
            id: employee.id,
            name: employee.name,
            status: employee.status,
            createdAt: employee.createdAt,
            vaultEncryptedDek: existing?.vaultEncryptedDek,
            vaultIv: existing?.vaultIv,
            vaultSalt: existing?.vaultSalt
        });
    }

    async updateVault(employeeId: string, data: {
        vaultEncryptedDek: ArrayBuffer;
        vaultIv: Uint8Array;
        vaultSalt: Uint8Array;
    }): Promise<void> {
        const existing = await db.employees.get(employeeId);
        if (!existing) {
            throw new Error('Employee not found in cache');
        }
        await db.employees.put({
            ...existing,
            ...data
        });
    }
}
