import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { WorkspaceProfile } from '../models/workspace.model';

export interface WorkspaceState {
    workspaces: WorkspaceProfile[];
    loading: boolean;
}

export const WorkspaceStore = signalStore(
    { providedIn: 'root' },
    withState<WorkspaceState>({ workspaces: [], loading: false }),
    withMethods((store: any) => ({
        setWorkspaces: (workspaces: WorkspaceProfile[]) => patchState(store, { workspaces }),
        setLoading: (loading: boolean) => patchState(store, { loading })
    }))
);
