import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { withEntities, setAllEntities, addEntity, removeEntity, updateEntity } from '@ngrx/signals/entities';
import { inject } from '@angular/core';
import { Terminal } from 'src/app/core/models/terminal.model';
import { TerminalRepository } from '../data/terminal.repository';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

export const TerminalStore = signalStore(
    { providedIn: 'root' },
    withEntities<Terminal>(),
    withState({ loading: false }),
    withMethods((store, repo = inject(TerminalRepository)) => ({

        loadAll: rxMethod<void>(pipe(
            tap(() => patchState(store, { loading: true })),
            switchMap(() => repo.findAll().pipe(
                tap(terminals => patchState(store, setAllEntities(terminals), { loading: false }))
            ))
        )),

        addTerminal(terminal: Terminal) {
            patchState(store, addEntity(terminal));
        },

        updateTerminal(terminal: Terminal) {
            patchState(store, updateEntity({ id: terminal.id, changes: terminal }));
        },

        removeTerminal(id: string) {
            patchState(store, removeEntity(id));
        }

    }))
);
