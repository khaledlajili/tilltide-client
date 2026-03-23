import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AccountProfile, CreateAccountCommand, UpdateAccountCommand } from '../../models/account.commands';

@Component({
    selector: 'account-create-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DialogModule, InputTextModule, ButtonModule],
    template: `
        <p-dialog
            [(visible)]="visible"
            [modal]="true"
            [style]="{ width: '640px' }"
            [header]="mode === 'edit' ? 'Edit Account' : 'New Account'"
            (onHide)="close()">
            <ng-template #content>
                <form [formGroup]="form" class="grid grid-cols-12 gap-4">
                    <div class="col-span-12">
                        <label class="block font-bold mb-2">Company Name</label>
                        <input pInputText formControlName="accountName" class="w-full" />
                    </div>

                    <div class="col-span-12 md:col-span-6">
                        <label class="block font-bold mb-2">Billing Email</label>
                        <input pInputText formControlName="billingEmail" class="w-full" />
                    </div>
                    <div class="col-span-12 md:col-span-6">
                        <label class="block font-bold mb-2">Phone Number</label>
                        <input pInputText formControlName="phoneNumber" class="w-full" />
                    </div>

                    <div class="col-span-12 md:col-span-6">
                        <label class="block font-bold mb-2">Tax ID</label>
                        <input pInputText formControlName="taxId" class="w-full" />
                    </div>
                    <div class="col-span-12 md:col-span-6">
                        <label class="block font-bold mb-2">Country</label>
                        <input pInputText formControlName="addressCountry" class="w-full" />
                    </div>

                    <div class="col-span-12">
                        <label class="block font-bold mb-2">Street Address</label>
                        <input pInputText formControlName="addressStreet" class="w-full" />
                    </div>

                    <div class="col-span-12 md:col-span-4">
                        <label class="block font-bold mb-2">City</label>
                        <input pInputText formControlName="addressCity" class="w-full" />
                    </div>
                    <div class="col-span-12 md:col-span-4">
                        <label class="block font-bold mb-2">State</label>
                        <input pInputText formControlName="addressState" class="w-full" />
                    </div>
                    <div class="col-span-12 md:col-span-4">
                        <label class="block font-bold mb-2">Postal Code</label>
                        <input pInputText formControlName="addressPostalCode" class="w-full" />
                    </div>
                </form>
            </ng-template>

            <ng-template #footer>
                <p-button label="Cancel" [text]="true" (onClick)="close()"></p-button>
                <p-button
                    [label]="mode === 'edit' ? 'Save Changes' : 'Create'"
                    icon="pi pi-check"
                    [loading]="loading"
                    (onClick)="submit()">
                </p-button>
            </ng-template>
        </p-dialog>
    `
})
export class CreateFormComponent implements OnChanges {
    @Input() visible = false;
    @Input() loading = false;
    @Input() mode: 'create' | 'edit' = 'create';
    @Input() account: AccountProfile | null = null;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() save = new EventEmitter<CreateAccountCommand | UpdateAccountCommand>();

    private fb = inject(FormBuilder);

    form: FormGroup = this.fb.group({
        accountId: [''],
        accountName: ['', [Validators.required, Validators.minLength(2)]],
        billingEmail: ['', [Validators.email]],
        phoneNumber: [''],
        taxId: [''],
        addressStreet: [''],
        addressCity: [''],
        addressState: [''],
        addressPostalCode: [''],
        addressCountry: ['']
    });

    ngOnChanges(changes: SimpleChanges) {
        if (changes['account'] && this.account) {
            this.form.patchValue({
                accountId: this.account.accountId,
                accountName: this.account.name,
                billingEmail: this.account.billingEmail,
                phoneNumber: this.account.phoneNumber,
                taxId: this.account.taxId,
                addressStreet: this.account.addressStreet,
                addressCity: this.account.addressCity,
                addressState: this.account.addressState,
                addressPostalCode: this.account.addressPostalCode,
                addressCountry: this.account.addressCountry
            });
        }

        if (changes['mode']) {
            const accountIdControl = this.form.get('accountId');
            if (this.mode === 'edit') {
                accountIdControl?.setValidators([Validators.required]);
            } else {
                accountIdControl?.clearValidators();
            }
            accountIdControl?.updateValueAndValidity({ emitEvent: false });
        }
    }

    submit() {
        if (this.form.valid) {
            if (this.mode === 'edit') {
                const command: UpdateAccountCommand = {
                    accountId: this.form.value.accountId,
                    name: this.form.value.accountName,
                    billingEmail: this.form.value.billingEmail,
                    phoneNumber: this.form.value.phoneNumber,
                    taxId: this.form.value.taxId,
                    addressStreet: this.form.value.addressStreet,
                    addressCity: this.form.value.addressCity,
                    addressState: this.form.value.addressState,
                    addressPostalCode: this.form.value.addressPostalCode,
                    addressCountry: this.form.value.addressCountry
                };
                this.save.emit(command);
            } else {
                const command: CreateAccountCommand = {
                    accountName: this.form.value.accountName,
                    billingEmail: this.form.value.billingEmail,
                    phoneNumber: this.form.value.phoneNumber,
                    taxId: this.form.value.taxId,
                    addressStreet: this.form.value.addressStreet,
                    addressCity: this.form.value.addressCity,
                    addressState: this.form.value.addressState,
                    addressPostalCode: this.form.value.addressPostalCode,
                    addressCountry: this.form.value.addressCountry
                };
                this.save.emit(command);
            }
        }
    }

    close() {
        this.visible = false;
        this.visibleChange.emit(false);
        this.form.reset();
    }
}
