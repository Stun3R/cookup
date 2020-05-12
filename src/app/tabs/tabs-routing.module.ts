import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";

const routes: Routes = [
  {
    path: "",
    redirectTo: "/private/home",
    pathMatch: "full",
  },
  {
    path: "",
    component: TabsPage,
    children: [
      {
        path: "home",
        loadChildren: () =>
          import("./home/home.module").then((m) => m.HomePageModule),
      },
      {
        path: "planning",
        loadChildren: () =>
          import("./planning/planning.module").then(
            (m) => m.PlanningPageModule
          ),
      },
      {
        path: "stocks",
        loadChildren: () =>
          import("./stocks/stocks.module").then((m) => m.StocksPageModule),
      },
      {
        path: "recipes",
        loadChildren: () =>
          import("./recipes/recipes.module").then((m) => m.RecipesPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
