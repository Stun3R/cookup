import { Component, OnInit } from "@angular/core";
import { ModalController, IonRouterOutlet } from "@ionic/angular";
import { StorageService } from "src/app/services/storage/storage.service";
import { StoreConstants, User, ErrorMode, House } from "src/app/interfaces";
import { StrapiService } from "src/app/services/strapi/strapi.service";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { SettingsComponent } from "src/app/modals/settings/settings.component";
import { HousesComponent } from "src/app/modals/houses/houses.component";

import * as dayjs from "dayjs";
import { Router } from "@angular/router";

require("dayjs/locale/fr");
dayjs.locale("fr");
const weekday = require("dayjs/plugin/weekday");
const isToday = require("dayjs/plugin/isToday");
dayjs.extend(weekday);
dayjs.extend(isToday);

declare module "dayjs" {
  interface Dayjs {
    weekday(int: number);
    isToday(): boolean;
  }
}

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  private user: User;

  private foods = [];
  private meals = [];
  private types = ["Petit déjeuner", "Déjeuner", "Dîner"];
  private places = {
    fridge: "Frigo",
    freezer: "Congélateur",
    pantry: "Cellier",
  };
  private userId;
  private weekday;
  private when;

  constructor(
    private strapi: StrapiService,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private storage: StorageService,
    private apollo: Apollo,
    private router: Router
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
      this.weekday = dayjs().weekday(this.user.current_house.list_at);
      if (this.weekday.isBefore(dayjs(), "day")) {
        const list_at = dayjs()
          .weekday(this.user.current_house.list_at)
          .add("7", "day");
        this.when = list_at.diff(dayjs(), "day");
      } else if (this.weekday.isAfter(dayjs(), "day")) {
        this.when = this.weekday.diff(dayjs(), "day") + 1;
      }
      await this.getFoodsExpiration();
      await this.getTodayMeals();
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
                list_at
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

  async getTodayMeals() {
    const meals = await this.strapi
      .getEntries("meals", {
        "house.id": this.user.current_house.id,
        _sort: "type:ASC",
        when: dayjs().format("YYYY-MM-DD"),
      })
      .toPromise();
    this.meals = meals || [];
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

  isToday() {
    return this.weekday.isToday();
  }

  async navigate() {
    if (!this.isToday()) {
      return;
    }
    const when = dayjs().format("YYYY-MM-DD").toString();
    await this.router.navigate([`/private/home/shopping-list/`, when]);
  }
}
