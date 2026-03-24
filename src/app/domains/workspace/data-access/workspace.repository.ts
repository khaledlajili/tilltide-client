import { inject, Injectable } from '@angular/core';
import { WorkspaceApiService } from './workspace.api.service';
import { Observable, throwError } from 'rxjs';
import { WorkspaceProfile } from '../models/workspace.model';
import { CreateWorkspaceCommand, UpdateWorkspaceCommand } from '../models/workspace.commands';

@Injectable({ providedIn: 'root' })
export class WorkspaceRepository {
    private api = inject(WorkspaceApiService);

    getWorkspacesByAccount(accountId: string): Observable<WorkspaceProfile[]> {
        if (!navigator.onLine) {
            return throwError(() => new Error('You must be online to fetch workspaces.'));
        }
        return this.api.getWorkspacesByAccount(accountId);
    }

    create(command: CreateWorkspaceCommand): Observable<WorkspaceProfile> {
        if (!navigator.onLine) {
            return throwError(() => new Error('You must be online to create a workspace.'));
        }
        return this.api.createWorkspace(command);
    }

    update(command: UpdateWorkspaceCommand): Observable<void> {
        if (!navigator.onLine) {
            return throwError(() => new Error('You must be online to update a workspace.'));
        }
        return this.api.updateWorkspace(command.workspaceId, command);
    }
}
