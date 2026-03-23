import { inject, Injectable } from '@angular/core';
import { PartyStore } from './state/party.store';
import { PartyRepository } from './data/party.repository';
import { Party } from 'src/app/core/models/party.model';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PartyFacade {
    private store = inject(PartyStore);
    private repo = inject(PartyRepository);

    parties = this.store.entities;
    loading = this.store.loading;

    init() { this.store.loadAll(); }

    save(party: Party) {
        return this.repo.save(party).pipe(tap(saved => this.store.upsertParty(saved)));
    }

    delete(id: string) {
        return this.repo.delete(id).pipe(tap(() => this.store.removeOne(id)));
    }
}
