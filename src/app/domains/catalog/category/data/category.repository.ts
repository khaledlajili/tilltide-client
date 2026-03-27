import { inject, Injectable } from '@angular/core';
import { CategoryApiService } from './category.api.service';
import { Category } from 'src/app/core/models/catalog.model';

@Injectable({ providedIn: 'root' })
export class CategoryRepository {
    private api = inject(CategoryApiService);

    findAll() { return this.api.getAll(); }
    save(category: Category) { return this.api.save(category); }
    delete(id: string) { return this.api.delete(id); }
}
