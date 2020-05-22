import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { AuthForgotPageRoutingModule } from "./auth-forgot-routing.module";

import { AuthForgotPage } from "./auth-forgot.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AuthForgotPageRoutingModule,
  ],
  declarations: [AuthForgotPage],
})
export class AuthForgotPageModule {}
