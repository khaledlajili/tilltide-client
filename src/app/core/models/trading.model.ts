import { MediaSummary } from '@/app/core/models/catalog.model';

export enum DocumentType {
    SALE_ORDER = 'SALE_ORDER',
    SALE = 'SALE',
    SALE_RETURN = 'SALE_RETURN',
    PURCHASE_ORDER = 'PURCHASE_ORDER',
    PURCHASE = 'PURCHASE',
    PURCHASE_RETURN = 'PURCHASE_RETURN'
}

export enum DocumentStatus {
    DRAFT = 'DRAFT',
    OPEN = 'OPEN',
    FULFILLED = 'FULFILLED',
    CANCELLED = 'CANCELLED'
}

export interface DocumentLine {
    id?: string;
    productId: string;
    unitId: string;
    quantity: number;
    unitPrice: number;
    productNameSnapshot?: string; // For UI display
    unitNameSnapshot?: string;    // For UI display
}

export interface Document {
    id: string;
    docNumber?: string;
    type: DocumentType;
    status: DocumentStatus;
    partyId: string;
    totalAmount: number;
    issueDate: string;
    lines: DocumentLine[];
    sourceDocumentId?: string;
    medias?: MediaSummary[];
}

export type CreateDocumentRequest = Omit<Document, 'id'> & { id?: string };
