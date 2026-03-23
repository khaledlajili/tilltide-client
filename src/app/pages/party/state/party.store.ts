import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { withEntities, setAllEntities, updateEntity, removeEntity } from '@ngrx/signals/entities';
import { inject } from '@angular/core';
import { Party } from 'src/app/core/models/party.model';
import { PartyRepository } from '../data/party.repository';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

export const PartyStore = signalStore(
    { providedIn: 'root' },
    withEntities<Party>(),
    withState({ loading: false }),
    withMethods((store, repo = inject(PartyRepository)) => ({
        loadAll: rxMethod<void>(pipe(
            tap(() => patchState(store, { loading: true })),
            switchMap(() => repo.findAll().pipe(
                tap(parties => patchState(store, setAllEntities(parties), { loading: false }))
            ))
        )),
        upsertParty(party: Party) {
            patchState(store, updateEntity({ id: party.id, changes: party }));
        },
        removeOne(id: string) {
            patchState(store, removeEntity(id));
        }
    }))
);
