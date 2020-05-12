import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthLocalPageRoutingModule } from './auth-local-routing.module';

import { AuthLocalPage } from './auth-local.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthLocalPageRoutingModule
  ],
  declarations: [AuthLocalPage]
})
export class AuthLocalPageModule {}
