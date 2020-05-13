import { Component, OnInit } from "@angular/core";
import { StrapiService } from "src/app/services/strapi/strapi.service";
import { Router } from "@angular/router";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-auth-local",
  templateUrl: "./auth-local.page.html",
  styleUrls: ["./auth-local.page.scss"],
})
export class AuthLocalPage implements OnInit {
  credentials = {
    identifier: "cookup@gmail.com",
    password: "mamakarima",
  };
  constructor(
    private strapi: StrapiService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  login() {
    this.strapi.login(this.credentials).subscribe(async (res) => {
      if (res) {
        this.router.navigate(["/private"]);
      } else {
        await this.presentAlert("Login Failed", "Wrong credentials");
      }
    });
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ["OK"],
    });

    await alert.present();
  }
}
