import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { WorkspaceContextService } from '@/app/core/services/workspace-context.service';

export const workspaceContextGuard: CanActivateFn = () => {
    const workspaceContext = inject(WorkspaceContextService);
    const router = inject(Router);

    if (!workspaceContext.hasWorkspaceContext()) {
        router.navigate(['/workspace/list']);
        return false;
    }

    return true;
};
