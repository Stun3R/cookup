import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { AuthResetPageRoutingModule } from "./auth-reset-routing.module";

import { AuthResetPage } from "./auth-reset.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthResetPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [AuthResetPage],
})
export class AuthResetPageModule {}
