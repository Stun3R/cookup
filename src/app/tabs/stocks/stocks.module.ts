import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { StocksPage } from "./stocks.page";

import { StocksPageRoutingModule } from "./stocks-routing.module";
import { DayjsExpirePipe } from "src/app/pipes/dates/dayjs-expire.pipe";
import { FoodCardComponent } from "src/app/components/food-card/food-card/food-card.component";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: "", component: StocksPage }]),
    StocksPageRoutingModule,
  ],
  entryComponents: [FoodCardComponent],
  declarations: [StocksPage, DayjsExpirePipe, FoodCardComponent],
})
export class StocksPageModule {}
