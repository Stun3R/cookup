import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShoppinglistViewPage } from './shoppinglist-view.page';

const routes: Routes = [
  {
    path: '',
    component: ShoppinglistViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShoppinglistViewPageRoutingModule {}
