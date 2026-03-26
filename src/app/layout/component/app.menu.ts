// Edited file: src/app/layout/component/app.menu.ts
import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AccountContextService } from '@/app/core/services/account-context.service';
import { WorkspaceContextService } from '@/app/core/services/workspace-context.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of model; track item.label) {
            @if (!item.separator) {
                <li app-menuitem [item]="item" [root]="true"></li>
            } @else {
                <li class="menu-separator"></li>
            }
        }
    </ul> `,
})
export class AppMenu {
    model: MenuItem[] = [];
    private accountContext = inject(AccountContextService);
    private workspaceContext = inject(WorkspaceContextService);

    constructor() {
        effect(() => {
            const accountId = this.accountContext.accountId();
            const hasAccount = !!accountId;
            const workspaceId = this.workspaceContext.workspaceId();
            const hasWorkspace = !!workspaceId;

            const items: MenuItem[] = [];

            if (hasAccount) {
                items.push({
                    label: 'Workspaces',
                    items: [
                        { label: 'List', icon: 'pi pi-fw pi-objects-column', routerLink: ['/workspace/list'] }
                    ]
                });
            }

            if (hasWorkspace) {
                items.push({
                    label: 'Business',
                    items: [
                        { label: 'Trading', icon: 'pi pi-fw pi-chart-line', routerLink: ['/trading'] },
                        { label: 'Catalog', icon: 'pi pi-fw pi-book', routerLink: ['/catalog'] },
                        { label: 'Party', icon: 'pi pi-fw pi-users', routerLink: ['/party'] },
                        { label: 'Terminal', icon: 'pi pi-fw pi-desktop', routerLink: ['/terminal'] },
                        { label: 'Employees', icon: 'pi pi-fw pi-id-card', routerLink: ['/employees'] }
                    ]
                });
            }

            items.push({
                label: 'Account',
                items: [
                    { label: 'Select', icon: 'pi pi-fw pi-briefcase', routerLink: ['/account/list'] },
                    ...(hasAccount && accountId
                        ? [
                            { label: 'Edit', icon: 'pi pi-fw pi-pencil', routerLink: ['/account/edit', accountId] },
                            { label: 'Access', icon: 'pi pi-fw pi-users', routerLink: ['/account/access'] },
                            { label: 'Roles', icon: 'pi pi-fw pi-shield', routerLink: ['/account/roles'] }
                        ]
                        : [])
                ]
            });

            this.model = items;
        });
    }
}
