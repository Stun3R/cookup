import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./guard/auth/auth.guard";

const routes: Routes = [
  { path: "", redirectTo: "auth", pathMatch: "full" },
  {
    path: "private",
    loadChildren: () =>
      import("./tabs/tabs.module").then((m) => m.TabsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: "auth",
    loadChildren: () =>
      import("./pages/auth/auth.module").then((m) => m.AuthPageModule),
  },
  {
    path: "auth/local",
    loadChildren: () =>
      import("./pages/auth-local/auth-local.module").then(
        (m) => m.AuthLocalPageModule
      ),
  },
  {
    path: "auth/register",
    loadChildren: () =>
      import("./pages/auth-register/auth-register.module").then(
        (m) => m.AuthRegisterPageModule
      ),
  },
  {
    path: "auth/forgot",
    loadChildren: () =>
      import("./pages/auth-forgot/auth-forgot.module").then(
        (m) => m.AuthForgotPageModule
      ),
  },
  {
    path: "auth/reset/:code",
    loadChildren: () =>
      import("./pages/auth-reset/auth-reset.module").then(
        (m) => m.AuthResetPageModule
      ),
  },
  {
    path: "**",
    redirectTo: "auth",
    pathMatch: "full",
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
