import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CreateAccountCommand } from '../../models/account.commands';

@Component({
    selector: 'account-create-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DialogModule, InputTextModule, ButtonModule],
    template: `
        <p-dialog
            [(visible)]="visible"
            [modal]="true"
            [style]="{ width: '640px' }"
            header="New Account"
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
                <p-button label="Create" icon="pi pi-check" [loading]="loading" (onClick)="submit()"></p-button>
            </ng-template>
        </p-dialog>
    `
})
export class CreateFormComponent {
    @Input() visible = false;
    @Input() loading = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() save = new EventEmitter<CreateAccountCommand>();

    private fb = inject(FormBuilder);

    form: FormGroup = this.fb.group({
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

    submit() {
        if (this.form.valid) {
            this.save.emit(this.form.value);
        }
    }

    close() {
        this.visible = false;
        this.visibleChange.emit(false);
        this.form.reset();
    }
}
