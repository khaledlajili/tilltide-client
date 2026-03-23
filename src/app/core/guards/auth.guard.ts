// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthFacade } from '@/app/domains/user/data-access/auth.facade';

export const authGuard: CanActivateFn = (route, state) => {
    const authFacade = inject(AuthFacade);
    const router = inject(Router);

    // Re-enable this! It stops the "flash" of the account page.
    if (!authFacade.isLoggedIn()) {
        console.warn('Guard blocked access - Redirecting to login');
        router.navigate(['/user/login']);
        return false;
    }

    return true;
};
