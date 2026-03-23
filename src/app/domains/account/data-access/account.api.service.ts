// Edited file: src/app/domains/account/data-access/account.api.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CreateAccountCommand, AccountProfile, UpdateAccountCommand } from '../models/account.commands';

@Injectable({ providedIn: 'root' })
export class AccountApiService {
    private http = inject(HttpClient);
    private url = `${environment.apiUrl}/api/accounts`;

    createAccount(command: CreateAccountCommand) {
        return this.http.post<AccountProfile>(this.url, command);
    }

    getAccount(id: string) {
        return this.http.get<AccountProfile>(`${this.url}/${id}`);
    }

    getAccounts() {
        return this.http.get<AccountProfile[]>(this.url);
    }

    updateAccount(id: string, command: UpdateAccountCommand) {
        return this.http.put<void>(`${this.url}/${id}`, command);
    }
}
