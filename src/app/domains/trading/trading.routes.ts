import { Routes } from '@angular/router';
import { TradingComponent } from '@/app/domains/trading/features/pos/trading.component';
import { DocumentListComponent } from '@/app/domains/trading/features/history/document-list.component';

export default [
    { path: '', component: TradingComponent },
    { path: 'list', component: DocumentListComponent },
] as Routes;
