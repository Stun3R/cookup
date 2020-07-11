import { Component, OnInit } from "@angular/core";
import { ModalController, IonRouterOutlet } from "@ionic/angular";
import { StorageService } from "src/app/services/storage/storage.service";
import { StoreConstants, User, ErrorMode } from "src/app/interfaces";
import { StrapiService } from "src/app/services/strapi/strapi.service";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { SettingsComponent } from "src/app/modals/settings/settings.component";
import { HousesComponent } from "src/app/modals/houses/houses.component";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  private user: User = {
    id: -1,
    username: "",
    email: "",
    provider: "",
    current_house: null,
    houses: [],
  };

  private foods = [];
  private userId;

  constructor(
    private strapi: StrapiService,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private storage: StorageService,
    private apollo: Apollo
  ) {}

  async ngOnInit() {
    this.userId = this.strapi.getUser().id;
  }
  async ionViewWillEnter() {
    await this.initAll();
  }

  async initAll() {
    await this.getUser();
    await this.storage.setItem(StoreConstants.USER, this.user);
    if (this.user.current_house === null && this.user.houses.length === 0) {
      await this.presentAskHouses();
    } else {
      await this.getFoodsExpiration();
    }
  }

  async getUser() {
    const response = await this.apollo
      .query<{ user: User }>({
        query: gql`
          query User($id: ID!) {
            user(id: $id) {
              id
              username
              email
              provider
              current_house {
                id
                name
              }
              houses {
                id
                name
              }
            }
          }
        `,
        variables: {
          id: this.userId,
        },
      })
      .toPromise();
    this.user = response.data.user;
  }

  async getFoodsExpiration() {
    const foods: any = await this.strapi
      .request("get", "/foods/expire", ErrorMode.Toast)
      .toPromise();
    this.foods = foods || [];
  }

  async presentUserPreferences() {
    const modal = await this.modalController.create({
      component: SettingsComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data.refresh) {
      await this.initAll();
    }
  }

  async presentAskHouses() {
    const modal = await this.modalController.create({
      component: HousesComponent,
      componentProps: {
        user: this.user,
      },
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data.refresh) {
      await this.initAll();
    }
  }
}
