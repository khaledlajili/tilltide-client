import { Routes } from '@angular/router';
import { BrandComponent } from '@/app/pages/catalog/brand/brand.component';
import { CategoryComponent } from '@/app/pages/catalog/category/category.component';
import { ProductComponent } from '@/app/pages/catalog/product/product.component';

export default [
    { path: 'brand', component: BrandComponent },
    { path: 'category', component: CategoryComponent },
    { path: 'product', component: ProductComponent },
] as Routes;
