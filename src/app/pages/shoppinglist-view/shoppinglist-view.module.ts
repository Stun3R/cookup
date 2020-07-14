import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShoppinglistViewPageRoutingModule } from './shoppinglist-view-routing.module';

import { ShoppinglistViewPage } from './shoppinglist-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShoppinglistViewPageRoutingModule
  ],
  declarations: [ShoppinglistViewPage]
})
export class ShoppinglistViewPageModule {}
