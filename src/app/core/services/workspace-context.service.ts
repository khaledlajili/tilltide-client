import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { environment } from '@/environments/environment';
import { authConfig } from '@/app/core/config/auth.config';
import { parseJwtPayload } from '@/app/core/utils/jwt';
import { catchError, Observable, tap, throwError } from 'rxjs';

const WORKSPACE_GRANT = 'urn:tilltide:params:oauth:grant-type:workspace';
const SUBJECT_TOKEN_TYPE = 'urn:ietf:params:oauth:token-type:access_token';

export interface WorkspaceTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope?: string;
}

@Injectable({ providedIn: 'root' })
export class WorkspaceContextService {
    private oauthService = inject(OAuthService);
    private http = inject(HttpClient);

    workspaceId = signal<string | null>(null);
    workspaceName = signal<string | null>(null);

    hasWorkspaceContext = computed(() => !!this.workspaceId());

    constructor() {
        this.refreshFromToken();
    }

    refreshFromToken() {
        const token = this.getActiveAccessToken();
        const payload = parseJwtPayload(token);
        const workspaceId = payload?.['workspace_id'];

        if (typeof workspaceId === 'string' && workspaceId.length > 0) {
            this.workspaceId.set(workspaceId);
            const storedWorkspaceName = localStorage.getItem('workspace_name');
            const storedWorkspaceId = localStorage.getItem('workspace_id');
            if (storedWorkspaceId === workspaceId && storedWorkspaceName) {
                this.workspaceName.set(storedWorkspaceName);
            }
        } else {
            this.workspaceId.set(null);
            this.workspaceName.set(null);
        }
    }

    selectWorkspace(workspaceId: string, workspaceName: string): Observable<WorkspaceTokenResponse> {
        const subjectToken = localStorage.getItem('account_access_token') || this.oauthService.getAccessToken();
        if (!subjectToken) {
            return throwError(() => new Error('Missing access token. Please log in again.'));
        }

        this.persistUserTokenIfNeeded(subjectToken);

        const params = new HttpParams({
            fromObject: {
                grant_type: WORKSPACE_GRANT,
                client_id: authConfig.clientId ?? 'tilltide-pwa',
                subject_token: subjectToken,
                subject_token_type: SUBJECT_TOKEN_TYPE,
                workspace_id: workspaceId
            }
        });

        const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

        return this.http.post<WorkspaceTokenResponse>(
            `${environment.apiUrl}/oauth2/token`,
            params.toString(),
            { headers }
        ).pipe(
            tap((response: WorkspaceTokenResponse) => {
                this.storeWorkspaceToken(response);
                this.persistWorkspaceContext(workspaceId, workspaceName);
                this.refreshFromToken();
            }),
            catchError((error: unknown) => throwError(() => error))
        );
    }

    clearWorkspaceContext() {
        localStorage.removeItem('workspace_access_token');
        localStorage.removeItem('workspace_id');
        localStorage.removeItem('workspace_name');
        this.workspaceId.set(null);
        this.workspaceName.set(null);
        this.refreshFromToken();
    }

    resetAll() {
        localStorage.removeItem('workspace_access_token');
        localStorage.removeItem('workspace_id');
        localStorage.removeItem('workspace_name');
        this.workspaceId.set(null);
        this.workspaceName.set(null);
    }

    private persistUserTokenIfNeeded(subjectToken: string) {
        const payload = parseJwtPayload(subjectToken);
        const workspaceId = payload?.['workspace_id'];
        if (typeof workspaceId === 'string' && workspaceId.length > 0) {
            return;
        }

        if (!localStorage.getItem('user_access_token')) {
            localStorage.setItem('user_access_token', subjectToken);
        }
    }

    private storeWorkspaceToken(response: WorkspaceTokenResponse) {
        localStorage.setItem('workspace_access_token', response.access_token);
    }

    private persistWorkspaceContext(workspaceId: string, workspaceName: string) {
        localStorage.setItem('workspace_id', workspaceId);
        localStorage.setItem('workspace_name', workspaceName);
        this.workspaceId.set(workspaceId);
        this.workspaceName.set(workspaceName);
    }

    private getActiveAccessToken(): string | null {
        return localStorage.getItem('terminal_access_token')
            || localStorage.getItem('workspace_access_token')
            || localStorage.getItem('account_access_token')
            || this.oauthService.getAccessToken();
    }
}
