import { inject, Injectable } from '@angular/core';
import { WorkspaceRepository } from './workspace.repository';
import { WorkspaceStore } from './workspace.store';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WorkspaceFacade {
    private repo = inject(WorkspaceRepository);
    private store = inject(WorkspaceStore);

    loadWorkspaces(accountId: string) {
        this.store.setLoading(true);
        return this.repo.getWorkspacesByAccount(accountId).pipe(
            tap((workspaces) => {
                this.store.setWorkspaces(workspaces);
                this.store.setLoading(false);
            })
        );
    }
}
