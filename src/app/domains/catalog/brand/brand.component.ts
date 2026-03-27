import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService, ConfirmationService } from 'primeng/api';
import { BrandFacade } from './data-access/brand.facade';
import { Brand, CreateBrandRequest } from 'src/app/core/models/catalog.model';
import { BrandFormComponent } from './ui/brand-form.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-brand',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, ToolbarModule, InputTextModule, ToastModule, ConfirmDialogModule, IconFieldModule, InputIconModule, BrandFormComponent, TranslatePipe],
    providers: [MessageService, ConfirmationService],
    templateUrl: './brand.component.html'
})
export class BrandComponent implements OnInit {
    @ViewChild('dt') dt!: Table;

    facade = inject(BrandFacade);
    private messageService = inject(MessageService);
    private confService = inject(ConfirmationService);

    brands = this.facade.brands;
    loading = this.facade.loading;

    brandDialog = false;
    isSaving = false;
    selectedBrand: Brand | CreateBrandRequest | null = null;
    selectedBrands: Brand[] | null = null;

    ngOnInit() {
        this.facade.init();
    }

    onFilter(event: Event) {
        this.dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.selectedBrand = { name: '', description: '', medias: [] };
        this.brandDialog = true;
    }

    edit(brand: Brand) {
        this.selectedBrand = { ...brand };
        this.brandDialog = true;
    }

    onSave(brand: Brand | CreateBrandRequest) {
        this.isSaving = true;
        this.facade.save(brand as Brand).subscribe({
            next: () => {
                this.brandDialog = false;
                this.isSaving = false;
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Brand Saved' });
            },
            error: () => (this.isSaving = false)
        });
    }

    delete(brand: Brand) {
        this.confService.confirm({
            message: `Are you sure you want to delete ${brand.name}?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.facade.delete(brand.id).subscribe(() => {
                    this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Brand removed' });
                });
            }
        });
    }

    deleteSelected() {
        this.confService.confirm({
            message: 'Are you sure you want to delete the selected brands?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // In a real SaaS, you'd call a bulk delete API.
                // For now, we loop or implement facade.deleteMultiple
                this.selectedBrands?.forEach((b) => this.facade.delete(b.id).subscribe());
                this.selectedBrands = null;
            }
        });
    }
}
