import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { WorkspaceProfile } from '../models/workspace.model';
import { CreateWorkspaceCommand, UpdateWorkspaceCommand } from '../models/workspace.commands';

@Injectable({ providedIn: 'root' })
export class WorkspaceApiService {
    private http = inject(HttpClient);
    private url = `${environment.apiUrl}/api/workspaces`;

    getWorkspacesByAccount(accountId: string) {
        return this.http.get<WorkspaceProfile[]>(`${this.url}?accountId=${accountId}`);
    }

    createWorkspace(command: CreateWorkspaceCommand) {
        return this.http.post<WorkspaceProfile>(this.url, command);
    }

    updateWorkspace(workspaceId: string, command: UpdateWorkspaceCommand) {
        return this.http.put<void>(`${this.url}/${workspaceId}`, command);
    }
}
