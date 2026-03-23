import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { WorkspaceProfile } from '../models/workspace.model';

@Injectable({ providedIn: 'root' })
export class WorkspaceApiService {
    private http = inject(HttpClient);
    private url = `${environment.apiUrl}/api/workspaces`;

    getWorkspacesByAccount(accountId: string) {
        return this.http.get<WorkspaceProfile[]>(`${this.url}?accountId=${accountId}`);
    }
}
