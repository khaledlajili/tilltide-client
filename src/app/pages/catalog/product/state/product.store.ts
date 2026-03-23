import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { withEntities, setAllEntities, updateEntity, removeEntity } from '@ngrx/signals/entities';
import { inject } from '@angular/core';
import { Product } from 'src/app/core/models/catalog.model';
import { ProductRepository } from '../data/product.repository';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

export const ProductStore = signalStore(
    { providedIn: 'root' },
    withEntities<Product>(),
    withState({ loading: false }),
    withMethods((store, repo = inject(ProductRepository)) => ({
        loadAll: rxMethod<void>(pipe(
            tap(() => patchState(store, { loading: true })),
            switchMap(() => repo.findAll().pipe(
                tap(products => patchState(store, setAllEntities(products), { loading: false }))
            ))
        )),
        upsertProduct(product: Product) {
            patchState(store, updateEntity({ id: product.id, changes: product }));
        },
        removeOne(id: string) {
            patchState(store, removeEntity(id));
        }
    }))
);
