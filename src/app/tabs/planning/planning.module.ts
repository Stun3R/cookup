import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PlanningPage } from "./planning.page";

import { PlanningPageRoutingModule } from "./planning-routing.module";
import { PlanningCardComponent } from "src/app/components/planning-card/planning-card.component";
import { DayjsRecipePipe } from "src/app/pipes/dates/dayjs-recipe.pipe";
import { DayjsExpirePipe } from "src/app/pipes/dates/dayjs-expire.pipe";

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, PlanningPageRoutingModule],
  declarations: [
    PlanningPage,
    PlanningCardComponent,
    DayjsRecipePipe,
    DayjsExpirePipe,
  ],
})
export class PlanningPageModule {}
