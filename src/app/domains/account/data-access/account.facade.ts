// src/app/domains/account/data-access/account.facade.ts
import { inject, Injectable } from '@angular/core';
import { AccountRepository } from './account.repository';
import { CreateAccountCommand, UpdateAccountCommand } from '../models/account.commands';
import { tap, switchMap, of } from 'rxjs';
import { AccountStore } from './account.store';

@Injectable({ providedIn: 'root' })
export class AccountFacade {
    private repo = inject(AccountRepository);
    private store = inject(AccountStore);

    register(command: CreateAccountCommand) {
        return this.repo.register(command).pipe(
            tap(profile => this.store.setProfile(profile))
        );
    }

    loadAccounts() {
        this.store.setLoading(true);
        return this.repo.getAccounts().pipe(
            tap(accounts => {
                this.store.setAccounts(accounts);
                this.store.setLoading(false);
            })
        );
    }

    /**
     * Fix: Pass the ID explicitly. Usually, this comes from
     * your Auth token or AuthFacade.
     */
    loadProfile(accountId: string) {
        return this.repo.getAccount(accountId).pipe(
            tap(profile => this.store.setProfile(profile))
        );
    }

    /**
     * Fix: Use switchMap to refresh the profile cleanly
     * without nested subscriptions.
     */
    update(command: UpdateAccountCommand) {
        return this.repo.update(command).pipe(
            switchMap(() => this.loadProfile(command.accountId))
        );
    }
}
