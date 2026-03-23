import { inject, Injectable } from '@angular/core';
import { WorkspaceApiService } from './workspace.api.service';
import { Observable, throwError } from 'rxjs';
import { WorkspaceProfile } from '../models/workspace.model';

@Injectable({ providedIn: 'root' })
export class WorkspaceRepository {
    private api = inject(WorkspaceApiService);

    getWorkspacesByAccount(accountId: string): Observable<WorkspaceProfile[]> {
        if (!navigator.onLine) {
            return throwError(() => new Error('You must be online to fetch workspaces.'));
        }
        return this.api.getWorkspacesByAccount(accountId);
    }
}
