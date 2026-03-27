import { Component, EventEmitter, Output, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-terminal-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DialogModule, InputTextModule, ButtonModule],
    template: `
<p-dialog [(visible)]="visible" header="Register Terminal" [modal]="true" (onHide)="close()">
    <form [formGroup]="form" class="flex flex-col gap-4">
        <div>
            <label class="block mb-2">Label</label>
            <input pInputText formControlName="label" class="w-full"/>
        </div>
    </form>

    <ng-template #footer>
        <p-button label="Cancel" [text]="true" (onClick)="close()"></p-button>
        <p-button label="Register" [disabled]="form.invalid" (onClick)="submit()"></p-button>
    </ng-template>
</p-dialog>
`
})
export class TerminalFormComponent {

    @Input() visible = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() save = new EventEmitter<{ label: string }>();

    private fb = inject(FormBuilder);

    form = this.fb.group({
        label: ['', Validators.required]
    });

    submit() {
        if (this.form.valid) this.save.emit(this.form.value as any);
    }

    close() {
        this.visibleChange.emit(false);
        this.form.reset();
    }
}
