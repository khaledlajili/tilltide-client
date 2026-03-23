import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthFacade } from '../../../user/data-access/auth.facade';
import { AppFloatingConfigurator } from '@/app/layout/component/app.floatingconfigurator';
import { AppLogo } from '@/app/layout/component/app-logo.component';
import { RegisterFormComponent } from '@/app/domains/user/ui/register-form/register-form.component';
import { RegisterUserCommand } from '../../../user/models/auth.commands';

@Component({
    selector: 'app-auth-register',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule,
        InputTextModule,
        PasswordModule,
        RippleModule,
        ToastModule,
        AppFloatingConfigurator,
        AppLogo,
        RegisterFormComponent
    ],
    providers: [MessageService],
    templateUrl: './register.component.html'
})
export class RegisterComponent {
    private authFacade = inject(AuthFacade);
    private router = inject(Router);
    private messageService = inject(MessageService);

    loading: boolean = false;

    onRegister(command: RegisterUserCommand) {
        this.loading = true;

        this.authFacade.register(command).subscribe({
            next: (res) => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User registred successfully!' });
                setTimeout(() => this.router.navigate(['/']), 1000);
            },
            error: (err) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Registration Failed',
                    detail: err.error?.message || err.message || 'Please check your information and try again.'
                });
            }
        });
    }
}
