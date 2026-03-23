// Edited file: src/app/layout/component/app.topbar.ts
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { Menu, MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '@/app/layout/service/layout.service';
import { AuthService } from '@/app/core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { AppLogo } from "@/app/layout/component/app-logo.component";
import { AuthFacade } from '@/app/domains/user/data-access/auth.facade';

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

    userMenuItems: MenuItem[] | undefined;
    currentLang = signal('en'); // Initialize with default

    ngOnInit() {
        // 1. Persistence Logic: Check localStorage on Init
        const savedLang = localStorage.getItem('lang') || 'en';
        this.translate.use(savedLang);
        this.currentLang.set(savedLang);

        this.userMenuItems = [
            {
                label: 'Account',
                items: [
                    {
                        label: 'Edit Account',
                        icon: 'pi pi-pencil',
                        routerLink: ['/account/edit']
                    },
                    {
                        label: 'Sign Out',
                        icon: 'pi pi-power-off',
                        command: () => this.onLogout()
                    }
                ]
            }
        ];
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
}
