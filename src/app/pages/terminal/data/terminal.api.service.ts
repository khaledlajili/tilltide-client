import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Terminal, RegisterTerminalRequest } from 'src/app/core/models/terminal.model';

@Injectable({ providedIn: 'root' })
export class TerminalApiService {

    private http = inject(HttpClient);
    private url = `${environment.apiUrl}/terminals`;

    getAll() {
        return this.http.get<Terminal[]>(this.url);
    }

    register(req: RegisterTerminalRequest) {
        return this.http.post<Terminal>(`${this.url}/register`, req);
    }

    revoke(id: string) {
        return this.http.put<void>(`${this.url}/${id}/revoke`, {});
    }

    delete(id: string) {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}
