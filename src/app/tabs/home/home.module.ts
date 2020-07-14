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
import { HousesComponent } from "src/app/modals/houses/houses.component";
import { AskHouseComponent } from "src/app/modals/houses/ask-house/ask-house.component";
import { FoodCardComponent } from "src/app/components/food-card/food-card/food-card.component";
import { PipeModule } from "src/app/pipes/pipe.module";

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    HomePageRoutingModule,
    QRCodeModule,
    PipeModule,
  ],
  entryComponents: [
    HousesComponent,
    AskHouseComponent,
    SettingsComponent,
    UserPreferencesComponent,
    HouseCreateComponent,
    HouseQrcodeComponent,
    HouseInformationsComponent,
    HouseMembersComponent,
    UserInformationsComponent,
    UserEditPasswordComponent,
    FoodCardComponent,
  ],
  declarations: [
    HomePage,
    HousesComponent,
    AskHouseComponent,
    SettingsComponent,
    UserPreferencesComponent,
    HouseCreateComponent,
    HouseQrcodeComponent,
    HouseInformationsComponent,
    HouseMembersComponent,
    UserInformationsComponent,
    UserEditPasswordComponent,
    FoodCardComponent,
  ],
})
export class HomePageModule {}
