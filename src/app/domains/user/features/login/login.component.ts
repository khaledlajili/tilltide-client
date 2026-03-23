import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthFacade } from '../../data-access/auth.facade';
import { AppFloatingConfigurator } from '@/app/layout/component/app.floatingconfigurator';
import { AppLogo } from '@/app/layout/component/app-logo.component';

@Component({
    selector: 'app-auth-login',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, ToastModule, AppFloatingConfigurator, AppLogo],
    providers: [MessageService],
    templateUrl: './login.component.html'
})
export class LoginComponent {
    private authFacade = inject(AuthFacade);
    loading = false;

    onLogin() {
        this.loading = true;
        this.authFacade.login();   // redirects to backend /oauth2/authorize
    }
}
