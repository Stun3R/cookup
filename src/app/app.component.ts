import { Component, NgZone } from "@angular/core";
import {
  Platform,
  NavController,
  AlertController,
  LoadingController,
} from "@ionic/angular";
import { StrapiService } from "./services/strapi/strapi.service";
import { Plugins, StatusBarStyle } from "@capacitor/core";
import * as qs from "qs";
import { Router } from "@angular/router";
import { Provider } from "./interfaces";

const { App, StatusBar, SplashScreen, Browser } = Plugins;

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private navController: NavController,
    private strapi: StrapiService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router,
    private zone: NgZone
  ) {
    this.initializeApp();
  }

  initializeApp() {
    App.addListener("appUrlOpen", (data: any) => {
      this.zone.run(() => {
        this.handleOpenURL(data.url);
      });
    });
    this.platform.ready().then(async () => {
      const user = await this.strapi.user.toPromise();
      if (user) {
        await this.navController.navigateRoot("/private");
      } else {
        await this.navController.navigateRoot("/login");
      }
      StatusBar.setStyle({ style: StatusBarStyle.Light });
      SplashScreen.hide();
    });
  }

  // TODO: Clean code -> PresentAlert / Loading global
  async handleOpenURL(url: any) {
    if (url.startsWith("cookup://auth/provider")) {
      this.connectWithProvider(url);
    }
    if (url.startsWith("cookup://auth/reset")) {
      const code = url.substring(url.lastIndexOf("/") + 1, url.length);
      await this.router.navigate(["/auth/reset", code]);
    }
  }

  async connectWithProvider(url: any) {
    Browser.close();
    this.presentLoading();
    let provider: Provider = url.substring(
      url.lastIndexOf("/") + 1,
      url.lastIndexOf("?")
    );
    const params = qs.parse(url).raw;
    const res = await this.strapi
      .authenticateProvider(provider, params)
      .toPromise();
    if (res) {
      await this.loadingController.dismiss();
      await this.router.navigate(["/private"]);
    } else {
      await this.loadingController.dismiss();
      await this.presentAlert("Login Failed", "Wrong credentials");
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
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: "Connexion...",
      spinner: "bubbles",
    });
    await loading.present();
  }
}
