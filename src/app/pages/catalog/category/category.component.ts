import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CategoryFacade } from './category.facade';
import { Category, CreateCategoryRequest } from 'src/app/core/models/catalog.model';
import { CategoryFormComponent } from './ui/category-form.component';

@Component({
    selector: 'app-category',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, ToolbarModule, ToastModule, ConfirmDialogModule, IconFieldModule, InputIconModule, CategoryFormComponent],
    providers: [MessageService, ConfirmationService],
    templateUrl: './category.component.html'
})
export class CategoryComponent implements OnInit {
    @ViewChild('dt') dt!: Table;
    facade = inject(CategoryFacade);
    private messageService = inject(MessageService);
    private confService = inject(ConfirmationService);

    categories = this.facade.categories;
    loading = this.facade.loading;

    categoryDialog = false;
    isSaving = false;
    selectedCategory: Category | CreateCategoryRequest | null = null;

    ngOnInit() { this.facade.init(); }

    getParentName(parentId: string) {
        return this.categories().find(c => c.id === parentId)?.name || '-';
    }

    openNew() {
        this.selectedCategory = { name: '', description: '', parent: undefined, medias: [] };
        this.categoryDialog = true;
    }

    edit(category: Category) {
        this.selectedCategory = { ...category };
        this.categoryDialog = true;
    }

    onSave(category: Category | CreateCategoryRequest) {
        this.isSaving = true;
        this.facade.save(category as Category).subscribe({
            next: () => {
                this.categoryDialog = false;
                this.isSaving = false;
                this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Category updated' });
            },
            error: () => this.isSaving = false
        });
    }

    delete(category: Category) {
        this.confService.confirm({
            message: `Delete ${category.name}?`,
            accept: () => {
                this.facade.delete(category.id).subscribe(() => {
                    this.messageService.add({ severity: 'info', summary: 'Deleted', detail: 'Category removed' });
                });
            }
        });
    }
}
