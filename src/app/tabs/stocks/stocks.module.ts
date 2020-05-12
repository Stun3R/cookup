import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { StocksPage } from "./stocks.page";

import { StocksPageRoutingModule } from "./stocks-routing.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: "", component: StocksPage }]),
    StocksPageRoutingModule,
  ],
  declarations: [StocksPage],
})
export class StocksPageModule {}
