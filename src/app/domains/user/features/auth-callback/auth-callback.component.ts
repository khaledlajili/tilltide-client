import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AccountContextService } from '@/app/core/services/account-context.service';

@Component({
    selector: 'app-auth-callback',
    standalone: true,
    imports: [CommonModule, ProgressSpinnerModule],
    template: `
    <div class="flex items-center justify-center min-h-screen bg-surface-50 dark:bg-surface-950">
      <div class="text-center">
        <p-progressSpinner styleClass="w-12 h-12" />
        <p class="mt-6 text-surface-700 dark:text-surface-300">Completing login...</p>
      </div>
    </div>
  `
})
export class AuthCallbackComponent implements OnInit {
    private oauthService = inject(OAuthService);
    private router = inject(Router);
  private accountContext = inject(AccountContextService);

    ngOnInit() {
        this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
          if (this.oauthService.hasValidAccessToken()) {
            this.accountContext.refreshFromToken();
            if (this.accountContext.hasAccountContext()) {
              this.router.navigate(['/']);
            } else {
              this.router.navigate(['/account/list']);
            }
          } else {
            this.router.navigate(['/user/login']);
          }
        }).catch(() => this.router.navigate(['/user/login']));
    }
}
