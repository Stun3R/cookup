import { Component, OnInit, Input } from "@angular/core";
import { HouseCreateComponent } from "../../settings/house-create/house-create.component";
import { User, ErrorMode, StoreConstants } from "src/app/interfaces";
import { NavParams, ModalController, LoadingController } from "@ionic/angular";
import { StrapiService } from "src/app/services/strapi/strapi.service";
import gql from "graphql-tag";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";

@Component({
  selector: "app-ask-house",
  templateUrl: "./ask-house.component.html",
  styleUrls: ["./ask-house.component.scss"],
})
export class AskHouseComponent implements OnInit {
  private user: User;
  private refresh = false;
  private loading;

  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private strapi: StrapiService,
    private barcodeScanner: BarcodeScanner,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.user = this.navParams.get("user");
  }

  async createHouse() {
    const nav = document.querySelector("ion-nav");
    await nav.push(HouseCreateComponent, {
      user: this.user,
      callback: null,
    });
  }

  async joinHouse() {
    try {
      const barcodeData = await this.barcodeScanner.scan({
        showTorchButton: true,
        disableAnimations: true,
        formats: "QR_CODE",
      });
      const loading = this.presentLoading();
      const user = await this.strapi
        .request("get", `/houses/${barcodeData.text}/join`, ErrorMode.Toast)
        .toPromise();
      if (user) {
        await this.loading.dismiss();
        await this.modalController.dismiss({
          refresh: false,
        });
      }
    } catch (error) {
      await this.loading.dismiss();
      console.log(error);
    }
  }

  async logout() {
    this.closeModal();
    await this.strapi.logout();
  }

  async closeModal() {
    await this.modalController.dismiss({
      refresh: false,
    });
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: "Traitement en cours...",
      spinner: "bubbles",
    });
    await this.loading.present();
  }
}
