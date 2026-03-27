import { inject, Injectable } from '@angular/core';
import { TradingApiService } from './trading.api.service';
import { CreateDocumentRequest, Document } from 'src/app/core/models/trading.model';

@Injectable({ providedIn: 'root' })
export class TradingRepository {
    private api = inject(TradingApiService);

    save(document: CreateDocumentRequest) {
        return this.api.save(document);
    }
    findAll() { return this.api.getAll(); }
}
