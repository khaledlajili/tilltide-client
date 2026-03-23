// New file: src/app/domains/user/data-access/auth.api.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RegisterUserCommand } from '../models/auth.commands';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
    private http = inject(HttpClient);
    private url = `${environment.apiUrl}/api/users`;

    register(command: RegisterUserCommand) {
        return this.http.post<string>(`${this.url}/register`, command);
    }
}
