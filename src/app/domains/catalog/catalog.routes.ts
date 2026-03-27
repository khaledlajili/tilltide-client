import { Routes } from '@angular/router';
import { BrandComponent } from '@/app/domains/catalog/brand/features/manage/brand.component';
import { CategoryComponent } from '@/app/domains/catalog/category/features/manage/category.component';
import { ProductComponent } from '@/app/domains/catalog/product/features/manage/product.component';

export default [
    { path: 'brand', component: BrandComponent },
    { path: 'category', component: CategoryComponent },
    { path: 'product', component: ProductComponent },
] as Routes;
