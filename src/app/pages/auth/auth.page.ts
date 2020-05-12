import { Component, OnInit } from "@angular/core";
import { Provider } from "src/app/interfaces";
import { SafariViewController } from "@ionic-native/safari-view-controller/ngx";
import { StrapiService } from "src/app/services/strapi/strapi.service";
import { Router } from "@angular/router";
import { AlertController, Platform } from "@ionic/angular";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"],
})
export class AuthPage implements OnInit {
  constructor(
    private strapi: StrapiService,
    private alertController: AlertController,
    private safariViewController: SafariViewController,
    private platform: Platform
  ) {}

  // TODO: Clean code subscribe
  async signIn(provider: Provider) {
    if (this.platform.is("ios")) {
      const available = await this.safariViewController.isAvailable();
      if (available) {
        this.safariViewController
          .show({
            url: this.strapi.getProviderAuthenticationUrl(provider),
          })
          .subscribe(
            (result: any) => {
              if (result.event === "opened") {
                console.log("opened");
              } else if (result.event === "loaded") console.log("Loaded");
              else if (result.event === "closed") console.log("Closed");
            },
            (error: any) => console.error(error)
          );
      }
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
