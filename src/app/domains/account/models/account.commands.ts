// Edited file: src/app/domains/account/models/account.commands.ts
export interface CreateAccountCommand {
    accountName: string;
    ownerEmail: string;
    ownerPassword: string;
    ownerFullName: string;
    billingEmail?: string;
    phoneNumber?: string;
    taxId?: string;
    addressStreet?: string;
    addressCity?: string;
    addressState?: string;
    addressPostalCode?: string;
    addressCountry?: string;
}

export interface UpdateAccountCommand {
    accountId: string;
    name?: string;
    billingEmail?: string;
    phoneNumber?: string;
    taxId?: string;
    addressStreet?: string;
    addressCity?: string;
    addressState?: string;
    addressPostalCode?: string;
    addressCountry?: string;
}

export interface AccountProfile {
    accountId: string;
    name: string;
    billingEmail?: string;
    phoneNumber?: string;
    taxId?: string;
    addressStreet?: string;
    addressCity?: string;
    addressState?: string;
    addressPostalCode?: string;
    addressCountry?: string;
    status: string;
    tenantId?: string;
    createdAt: string;
}
