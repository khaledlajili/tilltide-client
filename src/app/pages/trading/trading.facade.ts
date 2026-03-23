import { computed, inject, Injectable } from '@angular/core';
import { TradingStore } from './state/trading.store';
import { TradingRepository } from './data/trading.repository';
import { Document, DocumentType, CreateDocumentRequest } from 'src/app/core/models/trading.model';
import { tap } from 'rxjs';
import { ProductStore } from '@/app/pages/catalog/product/state/product.store';
import { BrandStore } from '@/app/pages/catalog/brand/state/brand.store';
import { CategoryStore } from '@/app/pages/catalog/category/state/category.store';
import { PartyStore } from '@/app/pages/party/state/party.store';

@Injectable({ providedIn: 'root' })
export class TradingFacade {
    private store = inject(TradingStore);
    private repo = inject(TradingRepository);

    productStore = inject(ProductStore);
    brandStore = inject(BrandStore);
    categoryStore = inject(CategoryStore);
    partyStore = inject(PartyStore);

    activeDocument = this.store.activeDocument;
    totalAmount = this.store.totalAmount;
    history = this.store.entities;
    loading = this.store.loading;

    initPos() {
        this.productStore.loadAll();
        this.brandStore.loadAll();
        this.categoryStore.loadAll();
        this.partyStore.loadAll();
    }

    loadHistory() {
        this.store.loadAll();
        this.partyStore.loadAll();
    }

    startNewTransaction() {
        this.store.resetActiveDocument();
    }

    /**
     * Logic: This is the 'Clone' feature.
     * It takes an existing Document from the history,
     * strips its ID, and loads it into the POS for editing.
     */
    startClonedTransaction(source: Document, targetType: DocumentType) {
        this.store.loadForCloning(source, targetType);
    }

    addToCart(line: any) { this.store.addLine(line); }
    removeLine(idx: number) { this.store.removeLine(idx); }
    updateLine(idx: number, changes: any) { this.store.updateLine(idx, changes); }

    // FIX: Use CreateDocumentRequest here because active doc might not have an ID
    updateDocument(changes: Partial<CreateDocumentRequest>) {
        this.store.updateDocument(changes);
    }

    filteredParties = computed(() => {
        const doc = this.activeDocument();
        const type = doc.type;
        const isPurchase = type.includes('PURCHASE');
        const requiredRole = isPurchase ? 'SUPPLIER' : 'CUSTOMER';
        return this.partyStore.entities().filter(p => p.types.includes(requiredRole));
    });

    /**
     * Logic: Backend receives the linked sourceDocumentId.
     * The backend will validate the link and save.
     */
    submit() {
        const docToSave = this.store.activeDocument();

        return this.repo.save(docToSave).pipe(
            tap((savedDoc: Document) => {
                // Clear the POS
                this.store.resetActiveDocument();
                // Add the newly created document (which now has an ID) to the history list
                this.store.addOneToHistory(savedDoc);
                // Refresh list to ensure any status changes (like 'Fulfilled') are reflected
                this.store.loadAll();
            })
        );
    }
}
