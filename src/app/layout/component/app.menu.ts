// Edited file: src/app/layout/component/app.menu.ts
import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AccountContextService } from '@/app/core/services/account-context.service';

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

    ngOnInit() {
        effect(() => {
            const accountId = this.accountContext.accountId();
            const hasAccount = !!accountId;

            const items: MenuItem[] = [];

            if (hasAccount) {
                items.push(
                    {
                        label: 'Transactions',
                        items: [
                            { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/trading/list'] },
                            { label: 'New Transaction', icon: 'pi pi-fw pi-plus-circle', routerLink: ['/trading'] }
                        ]
                    },
                    {
                        label: 'Catalog',
                        items: [
                            { label: 'Products', icon: 'pi pi-fw pi-box', routerLink: ['/catalog/product'] },
                            { label: 'Categories', icon: 'pi pi-fw pi-tags', routerLink: ['/catalog/category'] },
                            { label: 'Brands', icon: 'pi pi-fw pi-bookmark', routerLink: ['/catalog/brand'] }
                        ]
                    },
                    {
                        label: 'Parties',
                        items: [
                            { label: 'Parties', icon: 'pi pi-fw pi-users', routerLink: ['/party'] },
                            { label: 'Terminals', icon: 'pi pi-fw pi-tablet', routerLink: ['/terminal'] }
                        ]
                    },
                    {
                        label: 'Workspaces',
                        items: [
                            { label: 'List', icon: 'pi pi-fw pi-objects-column', routerLink: ['/workspace/list'] }
                        ]
                    }
                );
            }

            items.push({
                label: 'Account',
                items: [
                    { label: 'Select', icon: 'pi pi-fw pi-briefcase', routerLink: ['/account/list'] },
                    ...(hasAccount && accountId
                        ? [{ label: 'Edit', icon: 'pi pi-fw pi-pencil', routerLink: ['/account/edit', accountId] }]
                        : [])
                ]
            });

            this.model = items;
        });
    }
}
