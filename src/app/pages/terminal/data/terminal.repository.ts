import { inject, Injectable } from '@angular/core';
import { TerminalApiService } from './terminal.api.service';
import { Terminal, RegisterTerminalRequest } from 'src/app/core/models/terminal.model';

@Injectable({ providedIn: 'root' })
export class TerminalRepository {

    private api = inject(TerminalApiService);

    findAll() { return this.api.getAll(); }
    register(req: RegisterTerminalRequest) { return this.api.register(req); }
    revoke(id: string) { return this.api.revoke(id); }
    delete(id: string) { return this.api.delete(id); }
}
