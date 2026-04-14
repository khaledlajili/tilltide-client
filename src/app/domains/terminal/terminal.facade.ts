import { inject, Injectable } from '@angular/core';
import { TerminalStore } from './state/terminal.store';
import { TerminalRepository } from './data/terminal.repository';
import { TerminalCryptoService } from 'src/app/core/security/terminal-crypto.service';
import { TerminalStorageService } from 'src/app/core/security/terminal-storage.service';
import { RegisterTerminalRequest } from 'src/app/core/models/terminal.model';
import { from, switchMap, tap } from 'rxjs';
import { WorkspaceContextService } from 'src/app/core/services/workspace-context.service';

@Injectable({ providedIn: 'root' })
export class TerminalFacade {

    private store = inject(TerminalStore);
    private repo = inject(TerminalRepository);
    private crypto = inject(TerminalCryptoService);
    private storage = inject(TerminalStorageService);
    private workspaceContext = inject(WorkspaceContextService);

    terminals = this.store.entities;
    loading = this.store.loading;

    init() {
        const workspaceId = this.workspaceContext.workspaceId();
        if (workspaceId) {
            this.store.loadAll(workspaceId);
        }
    }

    register(label: string) {
        return from(this.crypto.generateKeyPair()).pipe(
            switchMap(async keyPair => {
                const workspaceId = this.workspaceContext.workspaceId();
                if (!workspaceId) {
                    throw new Error('Missing workspace context');
                }
                const context = await this.storage.loadTerminalContext();

                if (context?.terminalId && context?.terminalPublicKey && context?.terminalPrivateKey) {
                    throw new Error('This device is already registered. Revoke it first to register again.');
                }

                const publicKey = await this.crypto.exportPublicKey(keyPair.publicKey);

                const request: RegisterTerminalRequest = {
                    terminalId: context?.terminalId,
                    workspaceId,
                    label,
                    publicKey
                };

                return { keyPair, request };
            }),
            switchMap(({ keyPair, request }) =>
                this.repo.register(request).pipe(
                    switchMap(async terminal => {
                        await this.storage.saveTerminalContext({
                            terminalId: terminal.id,
                            terminalPrivateKey: keyPair.privateKey,
                            terminalPublicKey: keyPair.publicKey,
                            workspaceId: terminal.workspaceId
                        });
                        this.store.addTerminal(terminal);
                        return terminal;
                    })
                )
            )
        );
    }

    revoke(id: string) {
        const workspaceId = this.workspaceContext.workspaceId();
        if (!workspaceId) {
            throw new Error('Missing workspace context');
        }
        return this.repo.revoke(id, workspaceId).pipe(
            tap(() => this.store.updateTerminal({ id, status: 'REVOKED' } as any))
        );
    }
}
