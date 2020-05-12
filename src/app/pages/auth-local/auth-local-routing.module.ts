import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthLocalPage } from './auth-local.page';

const routes: Routes = [
  {
    path: '',
    component: AuthLocalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthLocalPageRoutingModule {}
