import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { SelectModule } from 'primeng/select'; // Correct for PrimeNG 18
import { Category, CreateCategoryRequest, MediaSummary } from 'src/app/core/models/catalog.model';
import { MediaApiService } from 'src/app/core/services/media.api.service';

@Component({
    selector: 'app-category-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DialogModule,
        InputTextModule,
        TextareaModule,
        ButtonModule,
        SelectModule,
        FileUploadModule
    ],
    templateUrl: './category-form.component.html'
})
export class CategoryFormComponent implements OnChanges {
    @Input() visible = false;
    @Input() category: Category | CreateCategoryRequest | null = null;
    @Input() categories: Category[] = [];
    @Input() loading = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() save = new EventEmitter<Category | CreateCategoryRequest>();

    private fb = inject(FormBuilder);
    private mediaApi = inject(MediaApiService);

    form: FormGroup = this.fb.group({
        id: [null],
        name: ['', [Validators.required, Validators.minLength(3)]],
        description: [''],
        parent: [null],
        medias: [[]]
    });

    // Helper to prevent a category from being its own parent
    get availableParents() {
        return this.categories.filter(c => c.id !== this.form.value.id);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['category'] && this.category) {
            this.form.patchValue(this.category);
        }
    }

    onUpload(event: any) {
        const file = event.files[0];
        // Create a local URL just for immediate UI preview before the form is saved
        const previewUrl = URL.createObjectURL(file);

        this.mediaApi.uploadAndConfirm(file, {
            fileName: file.name,
            ownerId: this.form.value.id || undefined,
            ownerType: 'CATEGORY',
            isPrimary: true
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
    }
}
