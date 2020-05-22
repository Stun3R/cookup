import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthResetPage } from './auth-reset.page';

const routes: Routes = [
  {
    path: '',
    component: AuthResetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthResetPageRoutingModule {}
