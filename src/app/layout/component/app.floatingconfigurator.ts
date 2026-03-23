import { Component, computed, inject, signal, input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { LayoutService } from '@/app/layout/service/layout.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-floating-configurator',
    standalone: true,
    imports: [CommonModule, ButtonModule],
    template: `
        <div class="flex gap-4 top-8 right-8 z-50" [ngClass]="{'fixed': float()}">
            <p-button
                type="button"
                (onClick)="toggleDarkMode()"
                [rounded]="true"
                [icon]="isDarkTheme() ? 'pi pi-moon' : 'pi pi-sun'"
                severity="secondary"
                styleClass="shadow-md border-none"
            />

            <p-button
                type="button"
                (onClick)="changeLang()"
                [rounded]="true"
                severity="secondary"
                styleClass="shadow-md border-none"
            >
                <span class="font-bold text-sm px-1">{{ currentLang() | uppercase }}</span>
            </p-button>
        </div>
    `
})
export class AppFloatingConfigurator implements OnInit {
    layoutService = inject(LayoutService);
    translate = inject(TranslateService);

    float = input<boolean>(true);
    currentLang = signal('en');

    isDarkTheme = computed(() => this.layoutService.layoutConfig().darkTheme);

    ngOnInit() {
        const savedLang = localStorage.getItem('lang') || 'en';
        this.translate.use(savedLang);
        this.currentLang.set(savedLang);
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
    }

    changeLang() {
        const nextLang = this.currentLang() === 'en' ? 'fr' : 'en';
        this.translate.use(nextLang);
        this.currentLang.set(nextLang);
        localStorage.setItem('lang', nextLang);
    }
}
