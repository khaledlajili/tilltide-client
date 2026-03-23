// New file: src/app/domains/user/ui/login-form/login-form.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RouterModule } from '@angular/router';
import { LoginCommand } from '../../models/auth.commands';

@Component({
    selector: 'auth-login-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        PasswordModule,
        RouterModule
    ],
    template: `
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div>
                <label for="email" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                <input
                    pInputText
                    id="email"
                    type="email"
                    formControlName="email"
                    placeholder="Email address"
                    class="w-full md:w-120 mb-6"
                    [class.ng-dirty]="loginForm.get('email')?.touched && loginForm.get('email')?.invalid"
                />

                <label for="password" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                <p-password
                    id="password"
                    formControlName="password"
                    placeholder="Password"
                    [toggleMask]="true"
                    styleClass="mb-8"
                    [fluid]="true"
                    [feedback]="true"> </p-password>

                <p-button
                    label="Sign In"
                    type="submit"
                    styleClass="w-full mb-4"
                    [loading]="loading"
                    [disabled]="loginForm.invalid">
                </p-button>

                <div class="text-center text-muted-color mt-4">
                    Don't have an account?
                    <a routerLink="/account/register" class="font-medium no-underline text-primary cursor-pointer">
                        Sign Up
                    </a>
                </div>
            </div>
        </form>
    `
})
export class LoginFormComponent {
    @Input() loading: boolean = false;
    @Output() login = new EventEmitter<LoginCommand>();

    loginForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.login.emit(this.loginForm.value);
        }
    }
}
