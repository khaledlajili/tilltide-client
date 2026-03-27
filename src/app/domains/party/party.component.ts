import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PartyFacade } from './data-access/party.facade';
import { Party } from 'src/app/core/models/party.model';
import { PartyFormComponent } from './ui/party-form.component';

@Component({
    selector: 'app-party',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, ToolbarModule, ToastModule, ConfirmDialogModule, TagModule, PartyFormComponent],
    providers: [MessageService, ConfirmationService],
    templateUrl: './party.component.html'
})
export class PartyComponent implements OnInit {
    facade = inject(PartyFacade);
    private messageService = inject(MessageService);
    private confService = inject(ConfirmationService);

    partyDialog = false;
    isSaving = false;
    selectedParty: any = null;

    ngOnInit() { this.facade.init(); }

    openNew() {
        this.selectedParty = { name: '', types: [], currentBalance: 0 };
        this.partyDialog = true;
    }

    edit(party: Party) {
        this.selectedParty = { ...party };
        this.partyDialog = true;
    }

    onSave(party: Party) {
        this.isSaving = true;
        this.facade.save(party).subscribe({
            next: () => {
                this.partyDialog = false;
                this.isSaving = false;
                this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Party updated' });
            },
            error: () => this.isSaving = false
        });
    }

    delete(party: Party) {
        this.confService.confirm({
            message: `Delete ${party.name}?`,
            accept: () => {
                this.facade.delete(party.id).subscribe(() => {
                    this.messageService.add({ severity: 'info', summary: 'Deleted', detail: 'Party removed' });
                });
            }
        });
    }
}
