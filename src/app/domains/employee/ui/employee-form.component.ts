import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-employee-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DialogModule,
        InputTextModule,
        ButtonModule
    ],
    template: `
        <p-dialog
            [(visible)]="visible"
            header="Add Employee"
            [modal]="true"
            (onHide)="close()">

            <form [formGroup]="form" class="flex flex-col gap-4">
                <div>
                    <label class="block mb-2">Name</label>
                    <input pInputText formControlName="name" class="w-full" />
                </div>
            </form>

            <ng-template #footer>
                <p-button
                    label="Cancel"
                    [text]="true"
                    (onClick)="close()">
                </p-button>

                <p-button
                    label="Save"
                    [disabled]="form.invalid"
                    (onClick)="submit()">
                </p-button>
            </ng-template>
        </p-dialog>
    `
})
export class EmployeeFormComponent {

    @Input() visible = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() save = new EventEmitter<{ name: string }>();

    private fb = inject(FormBuilder);

    form = this.fb.group({
        name: ['', Validators.required]
    });

    submit(): void {
        if (this.form.invalid) {
            return;
        }

        const { name } = this.form.value as { name: string };
        this.save.emit({ name });
    }

    close(): void {
        this.visibleChange.emit(false);
        this.form.reset();
    }
}
