import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HomePage } from "./home.page";

import { HomePageRoutingModule } from "./home-routing.module";
import { UserPreferencesComponent } from "src/app/modals/settings/user-preferences/user-preferences.component";
import { SettingsComponent } from "src/app/modals/settings/settings.component";
import { HouseCreateComponent } from "src/app/modals/settings/house-create/house-create.component";
import { HouseMembersComponent } from "src/app/modals/settings/house-members/house-members.component";
import { HouseInformationsComponent } from "src/app/modals/settings/house-informations/house-informations.component";
import { UserInformationsComponent } from "src/app/modals/settings/user-informations/user-informations.component";
import { UserEditPasswordComponent } from "src/app/modals/settings/user-edit-password/user-edit-password.component";
import { HouseQrcodeComponent } from "src/app/modals/settings/house-qrcode/house-qrcode.component";
import { QRCodeModule } from "angularx-qrcode";
import { HouseJoinComponent } from "src/app/modals/settings/house-join/house-join.component";

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    HomePageRoutingModule,
    QRCodeModule,
  ],
  entryComponents: [
    SettingsComponent,
    UserPreferencesComponent,
    HouseCreateComponent,
    HouseQrcodeComponent,
    HouseInformationsComponent,
    HouseMembersComponent,
    HouseJoinComponent,
    UserInformationsComponent,
    UserEditPasswordComponent,
  ],
  declarations: [
    HomePage,
    SettingsComponent,
    UserPreferencesComponent,
    HouseCreateComponent,
    HouseQrcodeComponent,
    HouseInformationsComponent,
    HouseMembersComponent,
    HouseJoinComponent,
    UserInformationsComponent,
    UserEditPasswordComponent,
  ],
})
export class HomePageModule {}
