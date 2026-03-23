// Edited file: src/app/domains/account/data-access/account.repository.ts
import { inject, Injectable } from '@angular/core';
import { AccountApiService } from './account.api.service';
import { CreateAccountCommand, AccountProfile, UpdateAccountCommand } from '../models/account.commands';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AccountRepository {
    private api = inject(AccountApiService);

    register(command: CreateAccountCommand): Observable<AccountProfile> {
        if (!navigator.onLine) {
            return throwError(() => new Error('You must be online to create an account.'));
        }

        return this.api.createAccount(command).pipe(
            catchError(error => {
                return throwError(() => error);
            })
        );
    }

    getAccount(id: string): Observable<AccountProfile> {
        if (!navigator.onLine) {
            return throwError(() => new Error('You must be online to fetch account information.'));
        }

        return this.api.getAccount(id).pipe(
            catchError(error => throwError(() => error))
        );
    }

    getAccounts(): Observable<AccountProfile[]> {
        if (!navigator.onLine) {
            return throwError(() => new Error('You must be online to fetch accounts list.'));
        }

        return this.api.getAccounts().pipe(
            catchError(error => throwError(() => error))
        );
    }

    update(command: UpdateAccountCommand): Observable<void> {
        if (!navigator.onLine) {
            return throwError(() => new Error('You must be online to update account.'));
        }

        return this.api.updateAccount(command.accountId, command).pipe(
            catchError(error => throwError(() => error))
        );
    }
}
