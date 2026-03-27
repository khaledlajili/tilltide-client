import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { Brand, CreateBrandRequest, MediaSummary } from 'src/app/core/models/catalog.model';
import { MediaApiService } from 'src/app/core/services/media.api.service';

@Component({
    selector: 'app-brand-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DialogModule, InputTextModule, TextareaModule, ButtonModule, FileUploadModule],
    templateUrl: './brand-form.component.html'
})
export class BrandFormComponent implements OnChanges {
    @Input() visible = false;
    @Input() brand: Brand | CreateBrandRequest | null = null;
    @Input() loading = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() save = new EventEmitter<Brand | CreateBrandRequest>();

    private fb = inject(FormBuilder);
    private mediaApi = inject(MediaApiService);

    form: FormGroup = this.fb.group({
        id: [null],
        name: ['', [Validators.required, Validators.minLength(2)]],
        description: [''],
        medias: [[]]
    });

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['brand'] && this.brand) {
            this.form.patchValue(this.brand);
        }
    }

    onUpload(event: any) {
        const file = event.files[0];
        // Create a local URL just for immediate UI preview before the form is saved
        const previewUrl = URL.createObjectURL(file);

        this.mediaApi.uploadAndConfirm(file, {
            fileName: file.name,
            ownerId: this.form.value.id,
            ownerType: 'BRAND',
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
