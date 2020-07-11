import { Component, OnInit } from "@angular/core";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { StorageService } from "src/app/services/storage/storage.service";
import { User, StoreConstants } from "src/app/interfaces";
import { StrapiService } from "src/app/services/strapi/strapi.service";
import { ToastController } from "@ionic/angular";

type Place = "all" | "fridge" | "freezer" | "pantry";

@Component({
  selector: "app-stocks",
  templateUrl: "stocks.page.html",
  styleUrls: ["stocks.page.scss"],
})
export class StocksPage implements OnInit {
  private currentPlace: Place = "all";
  private currentHouseId: number;
  private places = {
    fridge: "Frigo",
    freezer: "Congélateur",
    pantry: "Cellier",
  };
  private foods = {
    all: [],
    fridge: [],
    freezer: [],
    pantry: [],
  };
  private countPlaces = {
    all: 0,
    fridge: 0,
    freezer: 0,
    pantry: 0,
  };

  constructor(
    private apollo: Apollo,
    private storage: StorageService,
    private strapi: StrapiService,
    private toastController: ToastController
  ) {}

  async ngOnInit() {}

  async ionViewWillEnter() {
    // TODO: Opti in order to don't refetch data everytime you come on tab
    const user: User = await this.storage.getItem(StoreConstants.USER);
    this.foods = {
      all: [],
      fridge: [],
      freezer: [],
      pantry: [],
    };
    this.currentHouseId = user.current_house.id;
    await this.getFoodsCount();
    await this.getFoodsByPlace(this.currentPlace);
  }

  async getFoodsByPlace(place: Place) {
    const response = await this.apollo
      .query<any>({
        query: gql`
          query Foods($place: String, $house: ID) {
            foods(where: { place: $place, house: $house }) {
              id
              name
              quantity
              unit
              place
              expire_at
              food_category {
                id
                name
                icon
              }
            }
          }
        `,
        variables:
          place === "all"
            ? { house: this.currentHouseId }
            : {
                house: this.currentHouseId,
                place,
              },
      })
      .toPromise();
    if (this.foods[place].length) {
      return (this.foods[place] = this.foods[place].concat(
        response.data.foods
      ));
    }
    this.foods[place] = response.data.foods;
  }

  async getFoodsCount() {
    const count: any = await this.strapi.getEntryCount("foods").toPromise();
    this.countPlaces = count;
  }

  async switchPlace(place: Place) {
    if (this.currentPlace === place) {
      return console.log("REFRESH");
    }
    this.currentPlace = place;
    this.foods[place] = [];
    await this.getFoodsCount();
    await this.getFoodsByPlace(place);
  }

  async deleteFood(id: string, index: number) {
    const food: any = await this.strapi
      .deleteEntry("foods", id.toString())
      .toPromise();
    if (food) {
      await this.presentToast(`<strong>Produit supprimé</strong>`, "secondary");
      this.foods[this.currentPlace].splice(index, 1);
    }
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 2000,
    });
    toast.present();
  }
}
