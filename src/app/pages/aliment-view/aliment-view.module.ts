import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { AlimentViewPageRoutingModule } from "./aliment-view-routing.module";

import { AlimentViewPage } from "./aliment-view.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AlimentViewPageRoutingModule,
  ],
  declarations: [AlimentViewPage],
})
export class AlimentViewPageModule {}
