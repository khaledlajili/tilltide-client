import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Category } from 'src/app/core/models/catalog.model';

@Injectable({ providedIn: 'root' })
export class CategoryApiService {
    private http = inject(HttpClient);
    private url = `${environment.apiUrl}/api/categories`;

    getAll() { return this.http.get<Category[]>(this.url); }
    save(category: Category) { return this.http.post<Category>(this.url, category); }
    delete(id: string) { return this.http.delete<void>(`${this.url}/${id}`); }
}
