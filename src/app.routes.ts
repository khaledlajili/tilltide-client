// Edited file: src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Notfound } from './app/pages/notfound/notfound';
import { authGuard } from '@/app/core/guards/auth.guard';
import { workspaceContextGuard } from '@/app/core/guards/workspace-context.guard';
import { PartyComponent } from '@/app/pages/party/party.component';
import { TerminalComponent } from '@/app/pages/terminal/ui/terminal.component';
import { EmployeeComponent } from '@/app/pages/employee/ui/employee.component';
import { EditComponent } from '@/app/domains/account/features/edit/edit.component';
import { AuthCallbackComponent } from '@/app/domains/user/features/auth-callback/auth-callback.component';
import { InvitationsComponent } from '@/app/pages/invitations/invitations.component';
import { InviteComponent } from '@/app/pages/invite/invite.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'trading', pathMatch: 'full' },
            { path: 'party', component: PartyComponent, canActivate: [workspaceContextGuard] },
            { path: 'terminal', component: TerminalComponent, canActivate: [workspaceContextGuard] },
            { path: 'employees', component: EmployeeComponent, canActivate: [workspaceContextGuard] },
            { path: 'invitations', component: InvitationsComponent, canActivate: [workspaceContextGuard] },
            { path: 'catalog', loadChildren: () => import('./app/pages/catalog/catalog.routes'), canActivate: [workspaceContextGuard] },
            { path: 'trading', loadChildren: () => import('./app/pages/trading/trading.routes'), canActivate: [workspaceContextGuard] },
        ]
    },
    { path: 'account', loadChildren: () => import('./app/domains/account/account.routes') },
    { path: 'workspace', loadChildren: () => import('./app/domains/workspace/workspace.routes') },
    { path: 'invite', component: InviteComponent },
    { path: 'notfound', component: Notfound },
    { path: 'user', loadChildren: () => import('@/app/domains/user/auth.routes') },
    { path: 'auth/callback', component: AuthCallbackComponent },
    { path: '**', redirectTo: '/notfound' }
];
