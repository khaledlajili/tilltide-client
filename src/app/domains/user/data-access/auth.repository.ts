import { inject, Injectable } from '@angular/core';
import { AuthApiService } from './auth.api.service';
import { RegisterUserCommand } from '../models/auth.commands';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthRepository {
    private api = inject(AuthApiService);

    // login removed

    register(command: RegisterUserCommand): Observable<string> {
        if (!navigator.onLine) {
            return throwError(() => new Error('You must be online to register.'));
        }
        return this.api.register(command).pipe(
            catchError(error => throwError(() => error))
        );
    }
}
