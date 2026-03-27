import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { withEntities, setAllEntities, addEntity, updateEntity, removeEntity } from '@ngrx/signals/entities';
import { inject } from '@angular/core';
import { Category } from 'src/app/core/models/catalog.model';
import { CategoryRepository } from '../data/category.repository';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

export const CategoryStore = signalStore(
    { providedIn: 'root' },
    withEntities<Category>(),
    withState({ loading: false }),
    withMethods((store, repo = inject(CategoryRepository)) => ({
        loadAll: rxMethod<void>(pipe(
            tap(() => patchState(store, { loading: true })),
            switchMap(() => repo.findAll().pipe(
                tap(categories => patchState(store, setAllEntities(categories), { loading: false }))
            ))
        )),
        upsertCategory(category: Category) {
            patchState(store, updateEntity({ id: category.id, changes: category }));
        },
        removeOne(id: string) {
            patchState(store, removeEntity(id));
        }
    }))
);
