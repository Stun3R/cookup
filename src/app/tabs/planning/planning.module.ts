import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PlanningPage } from "./planning.page";

import { PlanningPageRoutingModule } from "./planning-routing.module";

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, PlanningPageRoutingModule],
  declarations: [PlanningPage],
})
export class PlanningPageModule {}
