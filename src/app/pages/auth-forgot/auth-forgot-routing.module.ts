import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthForgotPage } from './auth-forgot.page';

const routes: Routes = [
  {
    path: '',
    component: AuthForgotPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthForgotPageRoutingModule {}
