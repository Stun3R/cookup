import { IonicModule } from "@ionic/angular";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { TabsPageRoutingModule } from "./tabs-routing.module";

import { TabsPage } from "./tabs.page";
import { FoodCreateComponent } from "../modals/foods/food-create/food-create.component";
import { RecipesCreateComponent } from "../modals/recipes/recipes-create/recipes-create.component";
import { FoodsSearchComponent } from "../modals/recipes/foods-search/foods-search.component";
import { IonicSelectableModule } from "ionic-selectable";
import { MealCreateComponent } from "../modals/planning/meal-create/meal-create.component";
import { RecipesSearchComponent } from "../modals/planning/recipes-search/recipes-search.component";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TabsPageRoutingModule,
    IonicSelectableModule,
  ],
  entryComponents: [
    FoodCreateComponent,
    RecipesCreateComponent,
    FoodsSearchComponent,
    MealCreateComponent,
    RecipesSearchComponent,
  ],
  declarations: [
    TabsPage,
    FoodCreateComponent,
    RecipesCreateComponent,
    FoodsSearchComponent,
    MealCreateComponent,
    RecipesSearchComponent,
  ],
})
export class TabsPageModule {}
