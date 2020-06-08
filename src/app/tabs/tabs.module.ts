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
  ],
  declarations: [
    TabsPage,
    FoodCreateComponent,
    RecipesCreateComponent,
    FoodsSearchComponent,
  ],
})
export class TabsPageModule {}
