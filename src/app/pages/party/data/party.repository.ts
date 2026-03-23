import { inject, Injectable } from '@angular/core';
import { PartyApiService } from './party.api.service';
import { Party } from 'src/app/core/models/party.model';

@Injectable({ providedIn: 'root' })
export class PartyRepository {
    private api = inject(PartyApiService);
    findAll() { return this.api.getAll(); }
    save(party: Party) { return this.api.save(party); }
    delete(id: string) { return this.api.delete(id); }
}
