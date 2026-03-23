// Edited file: src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Notfound } from './app/pages/notfound/notfound';
import { authGuard } from '@/app/core/guards/auth.guard';
import { PartyComponent } from '@/app/pages/party/party.component';
import { TerminalComponent } from '@/app/pages/terminal/ui/terminal.component';
import { EditComponent } from '@/app/domains/account/features/edit/edit.component';
import { AuthCallbackComponent } from '@/app/domains/user/features/auth-callback/auth-callback.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'trading', pathMatch: 'full' },
            { path: 'party', component: PartyComponent },
            { path: 'terminal', component: TerminalComponent },
            { path: 'catalog', loadChildren: () => import('./app/pages/catalog/catalog.routes') },
            { path: 'trading', loadChildren: () => import('./app/pages/trading/trading.routes') },
        ]
    },
    { path: 'account', loadChildren: () => import('./app/domains/account/account.routes') },
    { path: 'notfound', component: Notfound },
    { path: 'user', loadChildren: () => import('@/app/domains/user/auth.routes') },
    { path: 'auth/callback', component: AuthCallbackComponent },
    { path: '**', redirectTo: '/notfound' }
];
