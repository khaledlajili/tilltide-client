import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AccountStore } from '../../data-access/account.store';
import { UpdateAccountCommand } from '../../models/account.commands';

@Component({
    selector: 'account-edit-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule],
    template: `
        <form [formGroup]="editForm" (ngSubmit)="onSubmit()" class="p-fluid">
            <div class="formgrid grid">
                <!-- Two‑column layout: every field gets col-12 md:col-6 -->
                <div class="field col-12 md:col-6">
                    <label for="name">Company Name</label>
                    <input
                        pInputText
                        id="name"
                        type="text"
                        formControlName="name"
                        class="w-full"
                        [class.ng-invalid]="editForm.get('name')?.invalid && editForm.get('name')?.touched"
                    />
                </div>

                <div class="field col-12 md:col-6">
                    <label for="billingEmail">Billing Email</label>
                    <input
                        pInputText
                        id="billingEmail"
                        type="email"
                        formControlName="billingEmail"
                        class="w-full"
                    />
                </div>

                <div class="field col-12 md:col-6">
                    <label for="phoneNumber">Phone Number</label>
                    <input
                        pInputText
                        id="phoneNumber"
                        type="text"
                        formControlName="phoneNumber"
                        class="w-full"
                    />
                </div>

                <div class="field col-12 md:col-6">
                    <label for="taxId">Tax ID</label>
                    <input
                        pInputText
                        id="taxId"
                        type="text"
                        formControlName="taxId"
                        class="w-full"
                    />
                </div>

                <div class="field col-12 md:col-6">
                    <label for="addressStreet">Street Address</label>
                    <input
                        pInputText
                        id="addressStreet"
                        type="text"
                        formControlName="addressStreet"
                        class="w-full"
                    />
                </div>

                <div class="field col-12 md:col-6">
                    <label for="addressCity">City</label>
                    <input
                        pInputText
                        id="addressCity"
                        type="text"
                        formControlName="addressCity"
                        class="w-full"
                    />
                </div>

                <div class="field col-12 md:col-6">
                    <label for="addressState">State</label>
                    <input
                        pInputText
                        id="addressState"
                        type="text"
                        formControlName="addressState"
                        class="w-full"
                    />
                </div>

                <div class="field col-12 md:col-6">
                    <label for="addressPostalCode">Postal Code</label>
                    <input
                        pInputText
                        id="addressPostalCode"
                        type="text"
                        formControlName="addressPostalCode"
                        class="w-full"
                    />
                </div>

                <div class="field col-12 md:col-6">
                    <label for="addressCountry">Country</label>
                    <input
                        pInputText
                        id="addressCountry"
                        type="text"
                        formControlName="addressCountry"
                        class="w-full"
                    />
                </div>
            </div>

            <!-- Form actions -->
            <div class="flex justify-content-end gap-2 mt-4">
                <p-button
                    label="Cancel"
                    severity="secondary"
                    type="button"
                    (onClick)="cancel.emit()"
                ></p-button>
                <p-button
                    label="Update"
                    type="submit"
                    [loading]="loading"
                    [disabled]="editForm.invalid"
                ></p-button>
            </div>
        </form>
    `,
})
export class EditFormComponent implements OnInit {
    @Input() loading = false;
    @Output() update = new EventEmitter<UpdateAccountCommand>();
    @Output() cancel = new EventEmitter<void>();

    editForm: FormGroup;
    private store = inject(AccountStore);

    constructor(private fb: FormBuilder) {
        this.editForm = this.fb.group({
            accountId: ['', Validators.required],
            name: ['', [Validators.required, Validators.minLength(2)]],
            billingEmail: ['', Validators.email],
            phoneNumber: [''],
            taxId: [''],
            addressStreet: [''],
            addressCity: [''],
            addressState: [''],
            addressPostalCode: [''],
            addressCountry: [''],
        });
    }

    ngOnInit() {
        const profile = this.store.profile();
        if (profile) {
            this.editForm.patchValue({
                accountId: profile.accountId,
                name: profile.name,
                billingEmail: profile.billingEmail,
                phoneNumber: profile.phoneNumber,
                taxId: profile.taxId,
                addressStreet: profile.addressStreet,
                addressCity: profile.addressCity,
                addressState: profile.addressState,
                addressPostalCode: profile.addressPostalCode,
                addressCountry: profile.addressCountry,
            });
        }
    }

    onSubmit() {
        if (this.editForm.valid) {
            this.update.emit(this.editForm.value);
        }
    }
}
