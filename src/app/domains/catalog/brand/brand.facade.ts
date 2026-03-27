import { inject, Injectable } from '@angular/core';
import { BrandStore } from './state/brand.store';
import { BrandRepository } from './data/brand.repository';
import { Brand } from 'src/app/core/models/catalog.model';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BrandFacade {
    private store = inject(BrandStore);
    private repo = inject(BrandRepository);

    brands = this.store.entities;
    loading = this.store.loading;

    init() { this.store.loadAll(); }

    save(brand: Brand) {
        return this.repo.save(brand).pipe(
            tap(saved => this.store.upsertBrand(saved))
        );
    }

    delete(id: string) {
        return this.repo.delete(id).pipe(
            tap(() => this.store.removeOne(id))
        );
    }
}
