import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockViewPage } from './stock-view.page';

const routes: Routes = [
  {
    path: '',
    component: StockViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockViewPageRoutingModule {}
