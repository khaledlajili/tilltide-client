import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountContextService } from '@/app/core/services/account-context.service';

export const accountContextGuard: CanActivateFn = () => {
    const accountContext = inject(AccountContextService);
    const router = inject(Router);

    if (!accountContext.hasAccountContext()) {
        router.navigate(['/account/list']);
        return false;
    }

    return true;
};
