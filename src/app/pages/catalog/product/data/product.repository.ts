import { inject, Injectable } from '@angular/core';
import { ProductApiService } from './product.api.service';
import { Product } from 'src/app/core/models/catalog.model';

@Injectable({ providedIn: 'root' })
export class ProductRepository {
    private api = inject(ProductApiService);

    findAll() { return this.api.getAll(); }
    save(product: Product) { return this.api.save(product); }
    delete(id: string) { return this.api.delete(id); }
}
