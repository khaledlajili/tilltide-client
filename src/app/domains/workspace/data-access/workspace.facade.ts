import { inject, Injectable } from '@angular/core';
import { WorkspaceRepository } from './workspace.repository';
import { WorkspaceStore } from './workspace.store';
import { tap, switchMap } from 'rxjs';
import { CreateWorkspaceCommand, UpdateWorkspaceCommand } from '../models/workspace.commands';

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

    create(command: CreateWorkspaceCommand) {
        return this.repo.create(command).pipe(
            switchMap(() => this.loadWorkspaces(command.accountId))
        );
    }

    update(command: UpdateWorkspaceCommand, accountId: string) {
        return this.repo.update(command).pipe(
            switchMap(() => this.loadWorkspaces(accountId))
        );
    }
}
