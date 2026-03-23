import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthFacade } from '@/app/domains/user/data-access/auth.facade';
import { OAuthService } from 'angular-oauth2-oidc';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.url.includes('blob.core.windows.net')) return next(req);

    const oauthService = inject(OAuthService);
    const authFacade = inject(AuthFacade);
    const router = inject(Router);

    const token = oauthService.getAccessToken();
    let headers = req.headers;
    if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const cloned = req.clone({ headers });

    return next(cloned).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 || error.status === 403) {
                authFacade.logout();
                router.navigate(['/user/login']);
            }
            return throwError(() => error);
        })
    );
};
