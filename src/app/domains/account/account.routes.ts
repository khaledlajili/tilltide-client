// Edited file: src/app/domains/account/account.routes.ts
import { Routes } from '@angular/router';
import {AccountListComponent} from "@/app/domains/account/features/list/list.component";
import {authGuard} from "@/app/core/guards/auth.guard";
import {EditComponent} from "@/app/domains/account/features/edit/edit.component";
import {AppLayout} from "@/app/layout/component/app.layout";

export default [
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            { path: 'list', component: AccountListComponent },
            { path: 'edit/:id', component: EditComponent }
        ]
    }
] as Routes;
