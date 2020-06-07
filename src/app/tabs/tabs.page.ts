import { Component } from "@angular/core";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { StrapiService } from "../services/strapi/strapi.service";
import { ErrorMode } from "../interfaces";
import {
  ModalController,
  IonRouterOutlet,
  LoadingController,
  AlertController,
} from "@ionic/angular";
import { FoodCreateComponent } from "../modals/foods/food-create/food-create.component";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";

@Component({
  selector: "app-tabs",
  templateUrl: "tabs.page.html",
  styleUrls: ["tabs.page.scss"],
})
export class TabsPage {
  private loading: HTMLIonLoadingElement;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private strapi: StrapiService,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private apollo: Apollo,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  async addStock() {
    const barcodeData = await this.barcodeScanner.scan({
      showTorchButton: true,
      disableAnimations: true,
      formats: "UPC_A,UPC_E,EAN_8,EAN_13",
    });
    await this.presentLoading();
    try {
      const product = await this.strapi
        .request("get", `/foods/${barcodeData.text}/scan`, ErrorMode.Toast)
        .toPromise();
      this.showFoodCreate(product);
    } catch (err) {
      await this.loading.dismiss();
    }

    /*     this.strapi
      .request("get", `/foods/${barcodeData.text}/scan`, ErrorMode.None)
      .toPromise()
      .then((product) => {
        this.showFoodCreate(product);
      })
      .catch(async (err) => {
        await this.loading.dismiss();
        console.log(err);
        if (err === "Food.scan.already") {
          await this.askChangeQuantity();
        }
      }); */
  }

  async showFoodCreate(product: any) {
    const response = await this.apollo
      .query<any>({
        query: gql`
          query FoodsCategories($limit: Int) {
            foodsCategories(limit: $limit) {
              id
              name
              icon
            }
          }
        `,
        variables: {
          limit: -1,
        },
      })
      .toPromise();
    await this.loading.dismiss();
    const modal = await this.modalController.create({
      component: FoodCreateComponent,
      componentProps: {
        product,
        foodsCategories: response.data.foodsCategories,
      },
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
    });

    await modal.present();
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: "Traitement en cours...",
      spinner: "bubbles",
    });
    await this.loading.present();
  }

  async askChangeQuantity() {
    const alert = await this.alertController.create({
      header: "Produit déjà ajouté",
      message:
        "Vous avez déjà ajouté ce produit, souhaitez vous changer sa quantité ?",
      buttons: [
        {
          text: "Non",
          role: "cancel",
          handler: () => {
            console.log("Nop");
          },
        },
        {
          text: "Oui",
          handler: () => {
            console.log("Oui");
          },
        },
      ],
    });

    await alert.present();
  }
}
