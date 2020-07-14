import { Component, OnInit } from "@angular/core";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { StorageService } from "src/app/services/storage/storage.service";
import { User, StoreConstants } from "src/app/interfaces";
import { StrapiService } from "src/app/services/strapi/strapi.service";
import { ToastController } from "@ionic/angular";
import { Subscription } from "rxjs";

type Place = "all" | "fridge" | "freezer" | "pantry";

@Component({
  selector: "app-stocks",
  templateUrl: "stocks.page.html",
  styleUrls: ["stocks.page.scss"],
})
export class StocksPage implements OnInit {
  private currentPlace: Place = "all";
  private currentHouseId: number;
  private openSearch: boolean = false;
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

  private foodsSubscription: Subscription;

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

  async cancelSearch() {
    this.openSearch = false;
    await this.getFoodsCount();
    await this.getFoodsByPlace(this.currentPlace);
  }

  searchFoods($event: { target: { value: string } }) {
    let text = $event.target.value.trim().toLowerCase();
    // BOOLEAN START SEARCH

    // Close any running subscription.
    if (this.foodsSubscription) {
      this.foodsSubscription.unsubscribe();
    }

    if (!text) {
      // Close any running subscription.
      if (this.foodsSubscription) {
        this.foodsSubscription.unsubscribe();
      }

      if (this.openSearch === true) {
        this.foods[this.currentPlace] = [];
      }

      return;
    }

    this.foodsSubscription = this.apollo
      .query<any>({
        query: gql`
          query Foods($place: String, $limit: Int, $house: ID, $name: String) {
            foods(
              limit: $limit
              where: { place: $place, house: $house, name_contains: $name }
            ) {
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
          this.currentPlace === "all"
            ? { house: this.currentHouseId, limit: -1, name: text }
            : {
                house: this.currentHouseId,
                place: this.currentPlace,
                limit: -1,
                name: text,
              },
      })
      .subscribe((response: any) => {
        // Subscription will be closed when unsubscribed manually.
        if (this.foodsSubscription.closed) {
          return;
        }

        this.foods[this.currentPlace] = response.data.foods;
        this.countPlaces[this.currentPlace] = response.data.foods.length;
        // BOOLEAN STOP SEARCH
      });
  }
}
