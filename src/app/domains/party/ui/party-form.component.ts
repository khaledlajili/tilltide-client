import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { Party, CreatePartyRequest } from 'src/app/core/models/party.model';

@Component({
    selector: 'app-party-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DialogModule, InputTextModule, TextareaModule, ButtonModule, MultiSelectModule, InputNumberModule],
    templateUrl: './party-form.component.html'
})
export class PartyFormComponent implements OnChanges {
    @Input() visible = false;
    @Input() party: Party | CreatePartyRequest | null = null;
    @Input() loading = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() save = new EventEmitter<Party>();

    private fb = inject(FormBuilder);

    partyTypeOptions = [
        { label: 'Customer', value: 'CUSTOMER' },
        { label: 'Supplier', value: 'SUPPLIER' }
    ];

    form: FormGroup = this.fb.group({
        id: [null],
        name: ['', [Validators.required]],
        types: [[], [Validators.required]],
        taxId: [''],
        address: [''],
        currentBalance: [0]
    });

    ngOnChanges(changes: SimpleChanges) {
        if (changes['party'] && this.party) this.form.patchValue(this.party);
    }

    submit() { if (this.form.valid) this.save.emit(this.form.value); }
    close() { this.visibleChange.emit(false); this.form.reset(); }
}
