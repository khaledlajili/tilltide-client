import { Routes } from '@angular/router';
import { PinComponent } from '@/app/domains/user/features/pin/pin.component';
import { LoginComponent } from '@/app/domains/user/features/login/login.component';
import { RegisterComponent } from '@/app/domains/user/features/register/register.component';

export default [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'pin', component: PinComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
] as Routes;
