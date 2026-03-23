import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Brand } from 'src/app/core/models/catalog.model';

@Injectable({ providedIn: 'root' })
export class BrandApiService {
    private http = inject(HttpClient);
    private url = `${environment.apiUrl}/api/brands`;

    getAll() { return this.http.get<Brand[]>(this.url); }
    save(brand: Brand) { return this.http.post<Brand>(this.url, brand); }
    delete(id: string) { return this.http.delete<void>(`${this.url}/${id}`); }
}
