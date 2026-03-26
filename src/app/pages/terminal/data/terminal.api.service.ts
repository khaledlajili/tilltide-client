import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Terminal, RegisterTerminalRequest } from 'src/app/core/models/terminal.model';

@Injectable({ providedIn: 'root' })
export class TerminalApiService {

    private http = inject(HttpClient);
    private url = `${environment.apiUrl}/api/terminals`;

    getAll(workspaceId: string) {
        return this.http.get<Terminal[]>(this.url, { params: { workspaceId } });
    }

    register(req: RegisterTerminalRequest) {
        return this.http.post<Terminal>(this.url, req);
    }

    revoke(id: string, workspaceId: string) {
        return this.http.post<void>(`${this.url}/${id}/revoke`, null, { params: { workspaceId } });
    }
}
