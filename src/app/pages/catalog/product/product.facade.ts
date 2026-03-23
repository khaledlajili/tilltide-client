import { inject, Injectable } from '@angular/core';
import { ProductStore } from './state/product.store';
import { ProductRepository } from './data/product.repository';
import { BrandStore } from '../brand/state/brand.store';
import { CategoryStore } from '../category/state/category.store';
import { Product } from 'src/app/core/models/catalog.model';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductFacade {
    private store = inject(ProductStore);
    private repo = inject(ProductRepository);
    private brandStore = inject(BrandStore);
    private categoryStore = inject(CategoryStore);

    products = this.store.entities;
    loading = this.store.loading;

    // Data for the form dropdowns
    brands = this.brandStore.entities;
    categories = this.categoryStore.entities;

    init() {
        this.store.loadAll();
        this.brandStore.loadAll(); // Ensure dropdowns have data
        this.categoryStore.loadAll();
    }

    save(product: Product) {
        return this.repo.save(product).pipe(
            tap(saved => this.store.upsertProduct(saved))
        );
    }

    delete(id: string) {
        return this.repo.delete(id).pipe(
            tap(() => this.store.removeOne(id))
        );
    }
}
