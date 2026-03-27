import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Party } from 'src/app/core/models/party.model';

@Injectable({ providedIn: 'root' })
export class PartyApiService {
    private http = inject(HttpClient);
    private url = `${environment.apiUrl}/api/parties`;

    getAll() { return this.http.get<Party[]>(this.url); }
    save(party: Party) { return this.http.post<Party>(this.url, party); }
    delete(id: string) { return this.http.delete<void>(`${this.url}/${id}`); }
}
