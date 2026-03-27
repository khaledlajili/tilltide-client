import { inject, Injectable } from '@angular/core';
import { BrandApiService } from './brand.api.service';
import { Brand } from 'src/app/core/models/catalog.model';

@Injectable({ providedIn: 'root' })
export class BrandRepository {
    private api = inject(BrandApiService);

    // Repository pattern allows us to swap this with IndexedDB logic later
    findAll() { return this.api.getAll(); }
    save(brand: Brand) { return this.api.save(brand); }
    delete(id: string) { return this.api.delete(id); }
}
