export interface Brand {
    id: string;
    name: string;
    description?: string;
    medias?: MediaSummary[]; // Array of Media UUIDs
}

// Used for Create operations where ID isn't known yet
export type CreateBrandRequest = Omit<Brand, 'id'> & { id?: string };

export interface Category {
    id: string;
    name: string;
    description?: string;
    parent?: string; // ID of the parent category
    medias?: MediaSummary[];
}

export type CreateCategoryRequest = Omit<Category, 'id'> & { id?: string };

export interface ProductUnit {
    id?: string;
    name: string;
    conversionFactor: number;
    base: boolean;
    defaultPurchasePrice?: number;
    defaultSalePrice?: number;
}

export interface Product {
    id: string;
    name: string;
    sku?: string;
    description?: string;
    minStockLevel?: number;
    brand: string; // Brand UUID
    categories: string[]; // Category UUIDs
    medias: MediaSummary[];
    units: ProductUnit[];
}

export type CreateProductRequest = Omit<Product, 'id'> & { id?: string };

export interface MediaSummary {
    id: string;
    url: string;
}

export interface Media {
    id: string;
    ownerId: string;
    ownerType: 'BRAND' | 'PRODUCT' | 'CATEGORY';
    blobPath: string;
    containerName: string;
    isPrimary: boolean;
    uploadedAt: string;
}

export interface MediaUploadRequest {
    fileName: string;
    ownerId?: string;
    ownerType: 'BRAND' | 'PRODUCT' | 'CATEGORY';
    isPrimary: boolean;
}

export interface MediaUploadResponse {
    uploadUrl: string;
    blobPath: string;
    containerName: string;
}
