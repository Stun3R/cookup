import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RecipesPage } from "./recipes.page";

import { RecipesPageRoutingModule } from "./recipes-routing.module";
import { DayjsPipe } from "src/app/pipes/dates/dayjs.pipe";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: "", component: RecipesPage }]),
    RecipesPageRoutingModule,
  ],
  declarations: [RecipesPage, DayjsPipe],
})
export class RecipesPageModule {}
