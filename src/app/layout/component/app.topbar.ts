// Edited file: src/app/layout/component/app.topbar.ts
import { Component, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { Menu, MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '@/app/layout/service/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { AppLogo } from "@/app/layout/component/app-logo.component";
import { AuthFacade } from '@/app/domains/user/data-access/auth.facade';
import { AccountContextService } from '@/app/core/services/account-context.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, MenuModule, ButtonModule, StyleClassModule, AppLogo],
    templateUrl: './app.topbar.html'
})
export class AppTopbar implements OnInit {
    @ViewChild('menu') menu!: Menu;

    layoutService = inject(LayoutService);
    authFacade = inject(AuthFacade);
    translate = inject(TranslateService);
    accountContext = inject(AccountContextService);
    router = inject(Router);

    userMenuItems: MenuItem[] | undefined;
    currentLang = signal('en'); // Initialize with default

    ngOnInit() {
        // 1. Persistence Logic: Check localStorage on Init
        const savedLang = localStorage.getItem('lang') || 'en';
        this.translate.use(savedLang);
        this.currentLang.set(savedLang);

        effect(() => {
            const accountId = this.accountContext.accountId();
            const accountName = this.accountContext.accountName();

            this.userMenuItems = [
                {
                    label: accountName ? `Account: ${accountName}` : 'Account',
                    items: [
                        ...(accountId
                            ? [{ label: 'Edit Account', icon: 'pi pi-pencil', routerLink: ['/account/edit', accountId] }]
                            : [{ label: 'Select Account', icon: 'pi pi-briefcase', routerLink: ['/account/list'] }]),
                        ...(accountId
                            ? [{ label: 'Leave Account', icon: 'pi pi-sign-out', command: () => this.onLeaveAccount() }]
                            : []),
                        {
                            label: 'Sign Out',
                            icon: 'pi pi-power-off',
                            command: () => this.onLogout()
                        }
                    ]
                }
            ];
        });
    }

    // 2. Switcher Logic: Toggle and Save
    changeLang() {
        const nextLang = this.currentLang() === 'en' ? 'fr' : 'en';

        this.translate.use(nextLang);
        this.currentLang.set(nextLang);

        // Save to localStorage
        localStorage.setItem('lang', nextLang);
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
    }

    onLogout() {
        if (this.menu) {
            this.menu.hide();
        }
        this.authFacade.logout();
    }

    onLeaveAccount() {
        if (this.menu) {
            this.menu.hide();
        }
        this.accountContext.clearAccountContext();
        this.router.navigate(['/account/list']);
    }
}
