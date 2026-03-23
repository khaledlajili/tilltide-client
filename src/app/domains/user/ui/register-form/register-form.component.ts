// Edited file: src/app/domains/account/ui/register-form/register-form.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RouterModule } from '@angular/router';
import { RegisterUserCommand } from '@/app/domains/user/models/auth.commands';

@Component({
    selector: 'account-register-form',
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
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div>
                <label for="fullName" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Full Name</label>
                <input
                    pInputText
                    id="fullName"
                    type="text"
                    formControlName="fullName"
                    placeholder="e.g. John Doe"
                    class="w-full md:w-120 mb-6"
                    [class.ng-dirty]="registerForm.get('fullName')?.touched && registerForm.get('fullName')?.invalid"
                />

                <label for="email" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                <input
                    pInputText
                    id="email"
                    type="email"
                    formControlName="email"
                    placeholder="Email address"
                    class="w-full md:w-120 mb-6"
                    [class.ng-dirty]="registerForm.get('email')?.touched && registerForm.get('email')?.invalid"
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
                    label="Sign Up"
                    type="submit"
                    styleClass="w-full mb-4"
                    [loading]="loading"
                    [disabled]="registerForm.invalid">
                </p-button>

                <div class="text-center text-muted-color mt-4">
                    Already registred?
                    <a routerLink="/user/login" class="font-medium no-underline text-primary cursor-pointer">
                        Sign In
                    </a>
                </div>
            </div>
        </form>
    `
})
export class RegisterFormComponent {
    @Input() loading: boolean = false;
    @Output() register = new EventEmitter<RegisterUserCommand>();

    registerForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.registerForm = this.fb.group({
            fullName: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

    onSubmit() {
        if (this.registerForm.valid) {
            this.register.emit(this.registerForm.value);
        }
    }
}
