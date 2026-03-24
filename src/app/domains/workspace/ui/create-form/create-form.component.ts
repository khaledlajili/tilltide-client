import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CreateWorkspaceCommand, UpdateWorkspaceCommand } from '../../models/workspace.commands';
import { WorkspaceProfile } from '../../models/workspace.model';

@Component({
    selector: 'workspace-create-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DialogModule, InputTextModule, ButtonModule],
    template: `
        <p-dialog
            [(visible)]="visible"
            [modal]="true"
            [style]="{ width: '520px' }"
            [header]="mode === 'edit' ? 'Edit Workspace' : 'New Workspace'"
            (onHide)="close()">
            <ng-template #content>
                <form [formGroup]="form" class="grid grid-cols-12 gap-4">
                    <div class="col-span-12">
                        <label class="block font-bold mb-2">Workspace Name</label>
                        <input pInputText formControlName="name" class="w-full" />
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
export class WorkspaceCreateFormComponent implements OnChanges {
    @Input() visible = false;
    @Input() loading = false;
    @Input() mode: 'create' | 'edit' = 'create';
    @Input() workspace: WorkspaceProfile | null = null;
    @Input() accountId: string | null = null;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() save = new EventEmitter<CreateWorkspaceCommand | UpdateWorkspaceCommand>();

    private fb = inject(FormBuilder);

    form: FormGroup = this.fb.group({
        workspaceId: [''],
        name: ['', [Validators.required, Validators.minLength(2)]]
    });

    ngOnChanges(changes: SimpleChanges) {
        if (changes['workspace'] && this.workspace) {
            this.form.patchValue({
                workspaceId: this.workspace.workspaceId,
                name: this.workspace.name
            });
        }
    }

    submit() {
        if (this.form.valid) {
            if (this.mode === 'edit') {
                const command: UpdateWorkspaceCommand = {
                    workspaceId: this.form.value.workspaceId,
                    name: this.form.value.name
                };
                this.save.emit(command);
            } else if (this.accountId) {
                const command: CreateWorkspaceCommand = {
                    accountId: this.accountId,
                    name: this.form.value.name
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
