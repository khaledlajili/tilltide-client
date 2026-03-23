import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { withEntities, setAllEntities, addEntity, updateEntity, removeEntity } from '@ngrx/signals/entities';
import { inject } from '@angular/core';
import { Brand } from 'src/app/core/models/catalog.model';
import { BrandRepository } from '../data/brand.repository';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

export const BrandStore = signalStore(
    { providedIn: 'root' },
    withEntities<Brand>(), // Strict Brand type
    withState({ loading: false }),
    withMethods((store, repo = inject(BrandRepository)) => ({
        loadAll: rxMethod<void>(pipe(
            tap(() => patchState(store, { loading: true })),
            switchMap(() => repo.findAll().pipe(
                tap(brands => patchState(store, setAllEntities(brands), { loading: false }))
            ))
        )),
        upsertBrand(brand: Brand) {
            // Use ngrx entity helpers correctly
            patchState(store, updateEntity({ id: brand.id, changes: brand }));
            // Note: addEntity is usually handled by the setAllEntities or a specific add method
        },
        // Add explicit methods for the store to avoid type mismatches in components
        addOne(brand: Brand) {
            patchState(store, addEntity(brand));
        },
        removeOne(id: string) {
            patchState(store, removeEntity(id));
        }
    }))
);
