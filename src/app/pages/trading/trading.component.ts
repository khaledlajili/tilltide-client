import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TradingFacade } from './trading.facade';
import { DocumentType } from 'src/app/core/models/trading.model';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-trading',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, SelectButtonModule, AutoCompleteModule, TableModule, InputNumberModule, SelectModule, CardModule, InputTextModule],
    templateUrl: './trading.component.html',
    styleUrls: ['./trading.component.scss']
})
export class TradingComponent implements OnInit {
    facade = inject(TradingFacade);

    searchQuery = signal('');
    selectedBrand = signal<string | null>(null);
    selectedCategory = signal<string | null>(null);

    selectedParty: any = null;

    // Correct Backend Enum Values
    docTypes = [
        { label: 'Sale Order', value: DocumentType.SALE_ORDER },
        { label: 'Sale', value: DocumentType.SALE },
        { label: 'S-Return', value: DocumentType.SALE_RETURN },
        { label: 'Purchase Order', value: DocumentType.PURCHASE_ORDER },
        { label: 'Purchase', value: DocumentType.PURCHASE },
        { label: 'P-Return', value: DocumentType.PURCHASE_RETURN }
    ];

    filteredProducts = computed(() => {
        const query = this.searchQuery().toLowerCase();
        return this.facade.productStore.entities().filter((p) =>
            p.name.toLowerCase().includes(query) &&
            (!this.selectedBrand() || p.brand === this.selectedBrand()) &&
            (!this.selectedCategory() || p.categories.includes(this.selectedCategory()!))
        );
    });

    // Auto-complete logic using the store instead of direct HTTP
    partiesSuggestions: any[] = [];
    searchParties(event: any) {
        const query = event.query.toLowerCase();
        this.partiesSuggestions = this.facade.filteredParties().filter(p =>
            p.name.toLowerCase().includes(query)
        );
    }

    // Check if we are linking
    linkedSourceId = computed(() => this.facade.activeDocument().sourceDocumentId);

    ngOnInit() {
        this.facade.initPos();
    }

    onProductClick(product: any) {
        const unit = product.units.find((u: any) => u.base) || product.units[0];
        const docType = this.facade.activeDocument().type;
        // Business logic: S-Return uses Sale Price, Purchase uses Purchase Price
        const isSaleSide = docType.includes('SALE');

        this.facade.addToCart({
            productId: product.id,
            unitId: unit.id,
            quantity: 1,
            unitPrice: isSaleSide ? unit.defaultSalePrice : unit.defaultPurchasePrice,
            productNameSnapshot: product.name,
            unitNameSnapshot: unit.name
        });
    }

    onPartyChange(party: any) {
        if (party) {
            this.facade.updateDocument({ partyId: party.id });
        } else {
            this.facade.updateDocument({ partyId: '' });
        }
    }

    save() {
        this.facade.submit().subscribe(() => {
            this.selectedParty = null;
        });
    }
}
