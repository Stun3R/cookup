import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Observable } from "rxjs";
import { StrapiService } from "src/app/services/strapi/strapi.service";
import { AlertController } from "@ionic/angular";
import { take, map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private strapi: StrapiService,
    private router: Router,
    private alertController: AlertController
  ) {}

  canActivate(): Observable<boolean> {
    return this.strapi.user.pipe(
      take(1),
      map((user) => {
        if (!user) {
          this.alertController
            .create({
              header: "Unauthorized",
              message: "You are not allowed to access that page.",
              buttons: ["OK"],
            })
            .then((alert) => alert.present());
          this.router.navigate(["/"]);
          return false;
        } else {
          return true;
        }
      })
    );
  }
}
