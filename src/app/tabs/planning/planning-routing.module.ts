import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PlanningPage } from "./planning.page";

const routes: Routes = [
  {
    path: "",
    component: PlanningPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanningPageRoutingModule {}
