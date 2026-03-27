import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Document, DocumentType } from 'src/app/core/models/trading.model';
import { TradingFacade } from './data-access/trading.facade';

@Component({
    selector: 'app-document-list',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, ToolbarModule, TagModule, TooltipModule],
    templateUrl: './document-list.component.html'
})
export class DocumentListComponent implements OnInit {
    facade = inject(TradingFacade);
    router = inject(Router);

    documents = this.facade.history;
    loading = this.facade.loading;

    ngOnInit() {
        this.facade.loadHistory();
    }

    getPartyName(id: string) {
        return this.facade.partyStore.entities().find(p => p.id === id)?.name || 'Unknown';
    }

    // 1. Create Fresh Sale/Purchase
    createNew() {
        this.facade.startNewTransaction();
        this.router.navigate(['/trading']);
    }

    // 2. Fulfill Order -> Create Linked Sale/Purchase
    fulfill(doc: Document) {
        const targetType = doc.type === DocumentType.SALE_ORDER ? DocumentType.SALE : DocumentType.PURCHASE;
        this.facade.startClonedTransaction(doc, targetType);
        this.router.navigate(['/trading']);
    }

    // 3. Return -> Create Linked Return
    createReturn(doc: Document) {
        const targetType = doc.type === DocumentType.SALE ? DocumentType.SALE_RETURN : DocumentType.PURCHASE_RETURN;
        this.facade.startClonedTransaction(doc, targetType);
        this.router.navigate(['/trading']);
    }

    // Helpers for UI
    getTypeSeverity(type: string) {
        if (type.includes('RETURN')) return 'warn';
        if (type.includes('ORDER')) return 'info';
        return 'success';
    }

    getStatusSeverity(status: string) {
        switch (status) {
            case 'FULFILLED': return 'success';
            case 'OPEN': return 'info';
            case 'CANCELLED': return 'danger';
            default: return 'secondary';
        }
    }

    downloadPdf(doc: Document) {
        // Find the primary PDF media (or just the first one in the list)
        const pdfMedia = doc.medias?.find(m => m.url.includes('.pdf')) || doc.medias?.[0];

        if (pdfMedia && pdfMedia.url) {
            // Option A: Open in new tab (best for PDFs)
            window.open(pdfMedia.url, '_blank');

            /* Option B: Direct download trigger
            const link = document.createElement('a');
            link.href = pdfMedia.url;
            link.download = `${doc.docNumber}.pdf`;
            link.click();
            */
        } else {
            // Handle case where PDF isn't ready yet (e.g., toast message)
            console.warn('PDF not found for this document');
        }
    }
}
