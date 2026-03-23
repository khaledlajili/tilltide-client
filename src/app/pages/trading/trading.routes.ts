import { Routes } from '@angular/router';
import { TradingComponent } from '@/app/pages/trading/trading.component';
import { DocumentListComponent } from '@/app/pages/trading/document-list.component';

export default [
    { path: '', component: TradingComponent },
    { path: 'list', component: DocumentListComponent },
] as Routes;
