import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProductFacade } from './product.facade';
import { Product } from 'src/app/core/models/catalog.model';
import { ProductFormComponent } from './ui/product-form.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    selector: 'app-product',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, ToolbarModule, ToastModule, ConfirmDialogModule, ProductFormComponent],
    providers: [MessageService, ConfirmationService],
    templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {
    facade = inject(ProductFacade);
    private messageService = inject(MessageService);
    private confService = inject(ConfirmationService);

    productDialog = false;
    isSaving = false;
    selectedProduct: any = null;

    ngOnInit() { this.facade.init(); }

    openNew() {
        this.selectedProduct = { name: '', units: [{ name: 'Piece', conversionFactor: 1, base: true }], categories: [], medias: [] };
        this.productDialog = true;
    }

    edit(product: Product) {
        this.selectedProduct = { ...product };
        this.productDialog = true;
    }

    onSave(product: Product) {
        this.isSaving = true;
        this.facade.save(product).subscribe({
            next: () => {
                this.productDialog = false;
                this.isSaving = false;
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product Saved' });
            },
            error: () => this.isSaving = false
        });
    }

    delete(product: Product) {
        this.confService.confirm({
            message: `Delete ${product.name}?`,
            accept: () => {
                this.facade.delete(product.id).subscribe(() => {
                    this.messageService.add({ severity: 'info', summary: 'Deleted', detail: 'Product removed' });
                });
            }
        });
    }
}
