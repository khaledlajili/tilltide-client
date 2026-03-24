// Edited file: src/app/domains/account/account.routes.ts
import { Routes } from '@angular/router';
import { AccountListComponent } from '@/app/domains/account/features/list/list.component';
import { authGuard } from '@/app/core/guards/auth.guard';
import { accountContextGuard } from '@/app/core/guards/account-context.guard';
import { EditComponent } from '@/app/domains/account/features/edit/edit.component';
import { AppLayout } from '@/app/layout/component/app.layout';
import { AccessComponent } from '@/app/domains/account/features/access/access.component';
import { RolesComponent } from '@/app/domains/account/features/roles/roles.component';

export default [
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            { path: 'list', component: AccountListComponent },
            { path: 'edit/:id', component: EditComponent, canActivate: [accountContextGuard] },
            { path: 'access', component: AccessComponent, canActivate: [accountContextGuard] },
            { path: 'roles', component: RolesComponent, canActivate: [accountContextGuard] }
        ]
    }
] as Routes;
