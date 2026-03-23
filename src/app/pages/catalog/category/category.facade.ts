import { inject, Injectable } from '@angular/core';
import { CategoryStore } from './state/category.store';
import { CategoryRepository } from './data/category.repository';
import { Category } from 'src/app/core/models/catalog.model';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryFacade {
    private store = inject(CategoryStore);
    private repo = inject(CategoryRepository);

    categories = this.store.entities;
    loading = this.store.loading;

    init() { this.store.loadAll(); }

    save(category: Category) {
        return this.repo.save(category).pipe(
            tap(saved => this.store.upsertCategory(saved))
        );
    }

    delete(id: string) {
        return this.repo.delete(id).pipe(
            tap(() => this.store.removeOne(id))
        );
    }
}
