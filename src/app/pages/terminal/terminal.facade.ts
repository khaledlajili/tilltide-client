import { inject, Injectable } from '@angular/core';
import { TerminalStore } from './state/terminal.store';
import { TerminalRepository } from './data/terminal.repository';
import { TerminalCryptoService } from 'src/app/core/security/terminal-crypto.service';
import { TerminalStorageService } from 'src/app/core/security/terminal-storage.service';
import { RegisterTerminalRequest } from 'src/app/core/models/terminal.model';
import { tap, from, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TerminalFacade {

    private store = inject(TerminalStore);
    private repo = inject(TerminalRepository);
    private crypto = inject(TerminalCryptoService);
    private storage = inject(TerminalStorageService);

    terminals = this.store.entities;
    loading = this.store.loading;

    init() {
        this.store.loadAll();
    }

    register(name: string, location?: string) {
        return from(this.crypto.generateKeyPair()).pipe(
            switchMap(async keyPair => {
                const publicKey = await this.crypto.exportPublicKey(keyPair.publicKey);

                const request: RegisterTerminalRequest = {
                    name,
                    location,
                    publicKey,
                    deviceFingerprint: navigator.userAgent
                };

                return { keyPair, request };
            }),
            switchMap(({ keyPair, request }) =>
                this.repo.register(request).pipe(
                    tap(async terminal => {
                        await this.storage.saveTerminalContext({
                            terminalId: terminal.id,
                            privateKey: keyPair.privateKey
                        });
                        this.store.addTerminal(terminal);
                    })
                )
            )
        );
    }

    revoke(id: string) {
        return this.repo.revoke(id).pipe(
            tap(() => this.store.updateTerminal({ id, status: 'REVOKED' } as any))
        );
    }

    delete(id: string) {
        return this.repo.delete(id).pipe(
            tap(() => this.store.removeTerminal(id))
        );
    }
}
