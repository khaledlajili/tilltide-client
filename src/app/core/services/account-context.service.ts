import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { environment } from '@/environments/environment';
import { authConfig } from '@/app/core/config/auth.config';
import { parseJwtPayload } from '@/app/core/utils/jwt';
import { catchError, Observable, tap, throwError } from 'rxjs';

const ACCOUNT_GRANT = 'urn:tilltide:params:oauth:grant-type:account';
const SUBJECT_TOKEN_TYPE = 'urn:ietf:params:oauth:token-type:access_token';

export interface AccountTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope?: string;
}

@Injectable({ providedIn: 'root' })
export class AccountContextService {
    private oauthService = inject(OAuthService);
    private http = inject(HttpClient);

    accountId = signal<string | null>(null);
    accountName = signal<string | null>(null);

    hasAccountContext = computed(() => !!this.accountId());

    constructor() {
        this.refreshFromToken();
    }

    refreshFromToken() {
        const token = this.oauthService.getAccessToken();
        const payload = parseJwtPayload(token);
        const accountId = payload?.['account_id'];

        if (typeof accountId === 'string' && accountId.length > 0) {
            this.accountId.set(accountId);
            const storedAccountName = localStorage.getItem('account_name');
            const storedAccountId = localStorage.getItem('account_id');
            if (storedAccountId === accountId && storedAccountName) {
                this.accountName.set(storedAccountName);
            }
        } else {
            this.accountId.set(null);
            this.accountName.set(null);
        }
    }

    selectAccount(accountId: string, accountName: string): Observable<AccountTokenResponse> {
        const subjectToken = this.oauthService.getAccessToken();
        if (!subjectToken) {
            return throwError(() => new Error('Missing access token. Please log in again.'));
        }

        this.persistUserTokenIfNeeded(subjectToken);

        const params = new HttpParams({
            fromObject: {
                grant_type: ACCOUNT_GRANT,
                client_id: authConfig.clientId,
                subject_token: subjectToken,
                subject_token_type: SUBJECT_TOKEN_TYPE,
                account_id: accountId
            }
        });

        const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

        return this.http.post<AccountTokenResponse>(
            `${environment.apiUrl}/oauth2/token`,
            params.toString(),
            { headers }
        ).pipe(
            tap((response: AccountTokenResponse) => {
                this.storeAccountToken(response);
                this.persistAccountContext(accountId, accountName);
                this.refreshFromToken();
            }),
            catchError((error: unknown) => throwError(() => error))
        );
    }

    clearAccountContext() {
        const storedUserToken = localStorage.getItem('user_access_token');
        const storedUserExpiresAt = localStorage.getItem('user_expires_at');
        const storedUserTokenType = localStorage.getItem('user_token_type');

        if (storedUserToken) {
            this.oauthService.storage.setItem('access_token', storedUserToken);
            if (storedUserExpiresAt) {
                this.oauthService.storage.setItem('expires_at', storedUserExpiresAt);
            }
            if (storedUserTokenType) {
                this.oauthService.storage.setItem('token_type', storedUserTokenType);
            }
        } else {
            this.oauthService.logOut();
        }

        localStorage.removeItem('account_access_token');
        localStorage.removeItem('account_id');
        localStorage.removeItem('account_name');
        this.accountId.set(null);
        this.accountName.set(null);
        this.refreshFromToken();
    }

    resetAll() {
        localStorage.removeItem('user_access_token');
        localStorage.removeItem('user_expires_at');
        localStorage.removeItem('user_token_type');
        localStorage.removeItem('account_access_token');
        localStorage.removeItem('account_id');
        localStorage.removeItem('account_name');
        this.accountId.set(null);
        this.accountName.set(null);
    }

    private persistUserTokenIfNeeded(subjectToken: string) {
        const payload = parseJwtPayload(subjectToken);
        const accountId = payload?.['account_id'];
        if (typeof accountId === 'string' && accountId.length > 0) {
            return;
        }

        if (!localStorage.getItem('user_access_token')) {
            localStorage.setItem('user_access_token', subjectToken);
            const expiresAt = this.oauthService.storage.getItem('expires_at');
            const tokenType = this.oauthService.storage.getItem('token_type');
            if (expiresAt) {
                localStorage.setItem('user_expires_at', expiresAt);
            }
            if (tokenType) {
                localStorage.setItem('user_token_type', tokenType);
            }
        }
    }

    private storeAccountToken(response: AccountTokenResponse) {
        const expiresAt = Date.now() + (response.expires_in * 1000);
        this.oauthService.storage.setItem('access_token', response.access_token);
        this.oauthService.storage.setItem('expires_at', String(expiresAt));
        this.oauthService.storage.setItem('token_type', response.token_type ?? 'Bearer');
        if (response.scope) {
            this.oauthService.storage.setItem('scope', response.scope);
        }

        localStorage.setItem('account_access_token', response.access_token);
    }

    private persistAccountContext(accountId: string, accountName: string) {
        localStorage.setItem('account_id', accountId);
        localStorage.setItem('account_name', accountName);
        this.accountId.set(accountId);
        this.accountName.set(accountName);
    }

}
