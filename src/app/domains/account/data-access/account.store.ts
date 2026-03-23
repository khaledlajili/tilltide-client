import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { AccountProfile } from '../models/account.commands';

export interface AccountState {
    profile: AccountProfile | null;
    accounts: AccountProfile[];
    loading: boolean;
}

export const AccountStore = signalStore(
    { providedIn: 'root' },
    withState<AccountState>({ profile: null, accounts: [], loading: false }),
    withMethods((store) => ({
        setProfile: (profile: AccountProfile) => patchState(store, { profile }),
        setAccounts: (accounts: AccountProfile[]) => patchState(store, { accounts }),
        setLoading: (loading: boolean) => patchState(store, { loading })
    }))
);
