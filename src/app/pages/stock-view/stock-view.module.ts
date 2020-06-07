import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { StockViewPageRoutingModule } from "./stock-view-routing.module";

import { StockViewPage } from "./stock-view.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    StockViewPageRoutingModule,
  ],
  declarations: [StockViewPage],
})
export class StockViewPageModule {}
