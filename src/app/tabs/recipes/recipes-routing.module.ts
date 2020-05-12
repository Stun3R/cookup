import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RecipesPage } from "./recipes.page";

const routes: Routes = [
  {
    path: "",
    component: RecipesPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesPageRoutingModule {}
