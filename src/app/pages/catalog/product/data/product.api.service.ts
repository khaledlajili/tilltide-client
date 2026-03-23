import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Product } from 'src/app/core/models/catalog.model';

@Injectable({ providedIn: 'root' })
export class ProductApiService {
    private http = inject(HttpClient);
    private url = `${environment.apiUrl}/api/products`;

    getAll() { return this.http.get<Product[]>(this.url); }
    save(product: Product) { return this.http.post<Product>(this.url, product); }
    delete(id: string) { return this.http.delete<void>(`${this.url}/${id}`); }
}
