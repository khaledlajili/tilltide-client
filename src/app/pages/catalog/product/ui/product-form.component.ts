import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ChipModule } from 'primeng/chip';
import { Product, CreateProductRequest, Brand, Category, MediaSummary } from 'src/app/core/models/catalog.model';
import { MediaApiService } from 'src/app/core/services/media.api.service';

@Component({
    selector: 'app-product-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DialogModule, InputTextModule, ButtonModule, SelectModule, MultiSelectModule, InputNumberModule, CheckboxModule, TableModule, FileUploadModule, ChipModule],
    templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnChanges {
    @Input() visible = false;
    @Input() product: Product | CreateProductRequest | null = null;
    @Input() brands: Brand[] = [];
    @Input() categories: Category[] = [];
    @Input() loading = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() save = new EventEmitter<Product>();

    private fb = inject(FormBuilder);
    private mediaApi = inject(MediaApiService);

    // Using FormGroup type explicitly to match Brand form style
    form: FormGroup = this.fb.group({
        id: [null],
        name: ['', [Validators.required]],
        sku: [''],
        description: [''],
        minStockLevel: [0],
        brand: [null, Validators.required],
        categories: [[] as string[]], // Typed as string array
        medias: [[] as MediaSummary[]],     // Typed as string array
        units: this.fb.array([])
    });

    get unitControls() {
        return this.form.get('units') as FormArray;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['product'] && this.product) {
            // Clear existing units before patching
            this.unitControls.clear();

            // Add form groups to the array based on incoming data
            if (this.product.units && this.product.units.length > 0) {
                this.product.units.forEach(() => this.addUnit());
            }

            this.form.patchValue(this.product);
        }
    }

    addUnit() {
        const unitForm = this.fb.group({
            id: [null],
            name: ['', Validators.required],
            conversionFactor: [1, [Validators.required, Validators.min(1)]],
            base: [false],
            defaultPurchasePrice: [0], // This matches the entity/DTO field
            defaultSalePrice: [0]
        });
        this.unitControls.push(unitForm);
    }

    removeUnit(index: number) {
        this.unitControls.removeAt(index);
    }

    onUpload(event: any) {
        const file = event.files[0];
        // Create a local URL just for immediate UI preview before the form is saved
        const previewUrl = URL.createObjectURL(file);

        this.mediaApi.uploadAndConfirm(file, {
            fileName: file.name,
            ownerId: this.form.value.id ?? undefined, // Added ownerId for consistency
            ownerType: 'PRODUCT',
            isPrimary: false
        }).subscribe(media => {
            const current = this.form.value.medias || [];

            // Construct the summary to match what the backend expects
            const newMediaSummary: MediaSummary = {
                id: media.id,
                url: previewUrl // Temporary local URL for preview
            };

            this.form.patchValue({ medias: [...current, newMediaSummary] });
        });
    }

    submit() {
        if (this.form.valid) {
            this.save.emit(this.form.value);
        }
    }

    close() {
        this.visibleChange.emit(false);
        this.form.reset();
        this.unitControls.clear(); // Ensure array is cleared for next open
    }
}
