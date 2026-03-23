export type PartyType = 'CUSTOMER' | 'SUPPLIER';

export interface Party {
    id: string;
    name: string;
    types: PartyType[];
    taxId?: string;
    address?: string;
    currentBalance: number;
}

export type CreatePartyRequest = Omit<Party, 'id'> & { id?: string };
