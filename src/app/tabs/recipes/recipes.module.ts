import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RecipesPage } from "./recipes.page";

import { RecipesPageRoutingModule } from "./recipes-routing.module";
import { DayjsRecipePipe } from "src/app/pipes/dates/dayjs-recipe.pipe";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: "", component: RecipesPage }]),
    RecipesPageRoutingModule,
  ],
  declarations: [RecipesPage, DayjsRecipePipe],
})
export class RecipesPageModule {}
