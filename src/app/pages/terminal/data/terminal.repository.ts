import { inject, Injectable } from '@angular/core';
import { TerminalApiService } from './terminal.api.service';
import { Terminal, RegisterTerminalRequest } from 'src/app/core/models/terminal.model';

@Injectable({ providedIn: 'root' })
export class TerminalRepository {

    private api = inject(TerminalApiService);

    findAll(workspaceId: string) { return this.api.getAll(workspaceId); }
    register(req: RegisterTerminalRequest) { return this.api.register(req); }
    revoke(id: string, workspaceId: string) { return this.api.revoke(id, workspaceId); }
}
