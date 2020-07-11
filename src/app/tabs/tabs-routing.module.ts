import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";
import { StockViewResolverService } from "../resolver/stockViewResolver/stock-view-resolver.service";
import { RecipeViewResolverService } from "../resolver/recipeViewResolver/recipe-view-resolver.service";

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
        path: "home/stocks/:id",
        resolve: {
          data: StockViewResolverService,
        },
        loadChildren: () =>
          import("../pages/stock-view/stock-view.module").then(
            (m) => m.StockViewPageModule
          ),
      },
      {
        path: "planning",
        loadChildren: () =>
          import("./planning/planning.module").then(
            (m) => m.PlanningPageModule
          ),
      },
      {
        path: "planning/recipes/:id",
        resolve: {
          data: RecipeViewResolverService,
        },
        loadChildren: () =>
          import("../pages/recipe-view/recipe-view.module").then(
            (m) => m.RecipeViewPageModule
          ),
      },
      {
        path: "planning/stocks/:id",
        resolve: {
          data: StockViewResolverService,
        },
        loadChildren: () =>
          import("../pages/stock-view/stock-view.module").then(
            (m) => m.StockViewPageModule
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
      {
        path: "recipes/:id",
        resolve: {
          data: RecipeViewResolverService,
        },
        loadChildren: () =>
          import("../pages/recipe-view/recipe-view.module").then(
            (m) => m.RecipeViewPageModule
          ),
      },
      {
        path: "stocks/:id",
        resolve: {
          data: StockViewResolverService,
        },
        loadChildren: () =>
          import("../pages/stock-view/stock-view.module").then(
            (m) => m.StockViewPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
