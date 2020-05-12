import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { StocksPage } from "./stocks.page";

const routes: Routes = [
  {
    path: "",
    component: StocksPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StocksPageRoutingModule {}
