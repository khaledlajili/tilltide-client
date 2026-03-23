import { inject, Injectable, signal } from '@angular/core';
import { AuthRepository } from './auth.repository';
import { RegisterUserCommand } from '../models/auth.commands';
import { OAuthService } from 'angular-oauth2-oidc';
import { filter } from 'rxjs/operators';
import { AccountContextService } from '@/app/core/services/account-context.service';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
    private repo = inject(AuthRepository);
    private oauthService = inject(OAuthService);
    private accountContext = inject(AccountContextService);

    private _isLoggedIn = signal<boolean>(false);
    readonly isLoggedIn = this._isLoggedIn.asReadonly();

    constructor() {
        // Reactive updates from library events
        this.oauthService.events.pipe(
            filter(e => ['token_received', 'token_refreshed', 'token_expiration', 'session_terminated', 'logout'].includes(e.type))
        ).subscribe(event => {
            if (event.type === 'token_received' || event.type === 'token_refreshed') {
                this._isLoggedIn.set(true);
                this.accountContext.refreshFromToken();
            } else {
                this._isLoggedIn.set(false);
                this.accountContext.refreshFromToken();
            }
        });

        // Initial state
        this._isLoggedIn.set(this.oauthService.hasValidAccessToken());
        this.accountContext.refreshFromToken();
    }

    // OAuth2 login (redirects to backend)
    login() {
        this.oauthService.initCodeFlow();
    }

    register(command: RegisterUserCommand) {
        return this.repo.register(command);
    }

    logout() {
        this.oauthService.logOut();           // clears tokens
        this._isLoggedIn.set(false);
        this.accountContext.resetAll();
    }

    checkAuthStatus(): boolean {
        return this.oauthService.hasValidAccessToken();
    }
}
