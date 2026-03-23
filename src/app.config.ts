import { ApplicationConfig, provideZonelessChangeDetection, importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';
import { providePrimeNG } from 'primeng/config';
import { provideTranslateService } from '@ngx-translate/core';
import { appRoutes } from './app.routes';
import { authInterceptor } from '@/app/core/interceptors/auth.interceptor';
import Nora from '@primeuix/themes/nora';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { authConfig } from '@/app/core/config/auth.config';

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(
            withInterceptors([authInterceptor]),
            withFetch()
        ),
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        provideZonelessChangeDetection(),
        providePrimeNG({ theme: { preset: Nora, options: { darkModeSelector: '.app-dark' } } }),
        provideTranslateService({
            loader: provideTranslateHttpLoader({ prefix: './i18n/', suffix: '.json' }),
            defaultLanguage: 'en'
        }),

        // OAuth2
        importProvidersFrom(OAuthModule.forRoot()),
        {
            provide: APP_INITIALIZER,
            useFactory: (oauthService: OAuthService) => () => {
                oauthService.configure(authConfig);
                return oauthService.loadDiscoveryDocument();   // loads .well-known/openid-configuration
            },
            deps: [OAuthService],
            multi: true
        }
    ]
};
