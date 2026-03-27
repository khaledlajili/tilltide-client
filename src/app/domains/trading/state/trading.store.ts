import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { withEntities, setAllEntities, addEntity } from '@ngrx/signals/entities';
import { computed, inject } from '@angular/core';
import { Document, CreateDocumentRequest, DocumentLine, DocumentType, DocumentStatus } from 'src/app/core/models/trading.model';
import { TradingRepository } from '../data/trading.repository';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

// The state needs to allow the active doc to have an optional ID
interface TradingState {
    activeDocument: CreateDocumentRequest;
    loading: boolean;
}

const INITIAL_DOC: CreateDocumentRequest = {
    type: DocumentType.SALE,
    status: DocumentStatus.OPEN,
    partyId: '',
    issueDate: '',
    lines: [],
    totalAmount: 0
};

export const TradingStore = signalStore(
    { providedIn: 'root' },
    withEntities<Document>(), // Entities are saved records with mandatory IDs
    withState<TradingState>({
        activeDocument: { ...INITIAL_DOC },
        loading: false
    }),
    withComputed((store) => ({
        totalAmount: computed(() =>
            store.activeDocument().lines.reduce((acc, line) => acc + (line.quantity * line.unitPrice), 0)
        )
    })),
    withMethods((store, repo = inject(TradingRepository)) => ({
        loadAll: rxMethod<void>(pipe(
            tap(() => patchState(store, { loading: true })),
            switchMap(() => repo.findAll().pipe(
                tap(docs => patchState(store, setAllEntities(docs), { loading: false }))
            ))
        )),

        resetActiveDocument() {
            patchState(store, {
                activeDocument: { ...INITIAL_DOC, issueDate: new Date().toISOString() }
            });
        },

        loadForCloning(source: Document, targetType: DocumentType) {
            const newLines: DocumentLine[] = source.lines.map(({id, ...line}) => ({
                ...line, // Remove the line ID to ensure they are treated as new lines
            }));

            patchState(store, {
                activeDocument: {
                    type: targetType,
                    status: DocumentStatus.OPEN,
                    partyId: source.partyId,
                    sourceDocumentId: source.id, // Store source ID for backend linking
                    issueDate: new Date().toISOString(),
                    lines: newLines,
                    totalAmount: source.totalAmount
                }
            });
        },

        updateDocument(changes: Partial<CreateDocumentRequest>) {
            patchState(store, (state) => ({
                activeDocument: { ...state.activeDocument, ...changes }
            }));
        },

        addLine(line: DocumentLine) {
            const lines = [...store.activeDocument().lines];
            const idx = lines.findIndex(l => l.productId === line.productId && l.unitId === line.unitId);
            if (idx > -1) {
                lines[idx] = { ...lines[idx], quantity: lines[idx].quantity + 1 };
            } else {
                lines.push(line);
            }
            patchState(store, (state) => ({ activeDocument: { ...state.activeDocument, lines } }));
        },

        updateLine(index: number, changes: Partial<DocumentLine>) {
            const lines = [...store.activeDocument().lines];
            lines[index] = { ...lines[index], ...changes };
            patchState(store, (state) => ({ activeDocument: { ...state.activeDocument, lines } }));
        },

        removeLine(index: number) {
            const lines = store.activeDocument().lines.filter((_, i) => i !== index);
            patchState(store, (state) => ({ activeDocument: { ...state.activeDocument, lines } }));
        },

        // This method will now work because Document has a required ID
        addOneToHistory(doc: Document) {
            patchState(store, addEntity(doc));
        }
    }))
);
