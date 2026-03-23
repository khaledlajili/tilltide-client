import { Routes } from '@angular/router';
import { AppLayout } from '@/app/layout/component/app.layout';
import { authGuard } from '@/app/core/guards/auth.guard';
import { accountContextGuard } from '@/app/core/guards/account-context.guard';
import { WorkspaceListComponent } from '@/app/domains/workspace/features/list/list.component';

export default [
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard, accountContextGuard],
        children: [
            { path: 'list', component: WorkspaceListComponent }
        ]
    }
] as Routes;
