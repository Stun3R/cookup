import { Component, OnInit } from "@angular/core";
import { Provider } from "src/app/interfaces";
import { StrapiService } from "src/app/services/strapi/strapi.service";
import { Router } from "@angular/router";
import { AlertController, Platform } from "@ionic/angular";
import { Plugins } from "@capacitor/core";

const { Browser } = Plugins;

@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"],
})
export class AuthPage implements OnInit {
  constructor(
    private strapi: StrapiService,
    private alertController: AlertController,
    private platform: Platform
  ) {}

  // TODO: Clean code subscribe
  signIn(provider: Provider) {
    if (this.platform.is("ios")) {
      Browser.open({
        url: this.strapi.getProviderAuthenticationUrl(provider),
      }).catch((error) => {
        console.error(error);
      });
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ["OK"],
    });

    await alert.present();
  }

  ngOnInit() {}
}
