import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CreateDocumentRequest, Document } from 'src/app/core/models/trading.model';

@Injectable({ providedIn: 'root' })
export class TradingApiService {
    private http = inject(HttpClient);
    private url = `${environment.apiUrl}/api/documents`;

    save(document: CreateDocumentRequest) { // Change type here
        return this.http.post<Document>(this.url, document);
    }

    getAll() {
        return this.http.get<Document[]>(this.url);
    }
}
