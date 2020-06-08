import { Component, OnInit, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { IonicSelectableComponent } from "ionic-selectable";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { User } from "src/app/interfaces";

@Component({
  selector: "app-foods-search",
  templateUrl: "./foods-search.component.html",
  styleUrls: ["./foods-search.component.scss"],
})
export class FoodsSearchComponent implements OnInit {
  @Input() user: User;
  private foods: any;
  private food: any;
  private foodsSubscription: Subscription;
  private quantity: number = 0;
  private openSearch: boolean = false;
  private places = {
    fridge: "Frigo",
    freezer: "Congélateur",
    pantry: "Cellier",
  };

  constructor(
    private modalController: ModalController,
    private apollo: Apollo
  ) {}

  ngOnInit() {}

  /*   searchFoods(event: { component: IonicSelectableComponent; text: string }) {
    let text = event.text.trim().toLowerCase();
    console.log(text);
    event.component.startSearch();

    // Close any running subscription.
    if (this.foodsSubscription) {
      this.foodsSubscription.unsubscribe();
    }

    if (!text) {
      // Close any running subscription.
      if (this.foodsSubscription) {
        this.foodsSubscription.unsubscribe();
      }

      event.component.items = [];
      event.component.endSearch();
      return;
    }

    this.foodsSubscription = this.apollo
      .query<any>({
        query: gql`
          query Foods($limit: Int, $house: ID, $name: String) {
            foods(
              limit: $limit
              where: { house: $house, name_contains: $name }
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
        variables: {
          limit: -1,
          house: this.user.current_house.id,
          name: text,
        },
      })
      .subscribe((response: any) => {
        // Subscription will be closed when unsubscribed manually.
        if (this.foodsSubscription.closed) {
          return;
        }

        event.component.items = response.data.foods;
        event.component.endSearch();
      });
  } */
  searchFoods($event: { target: { value: string } }) {
    let text = $event.target.value.trim().toLowerCase();
    console.log(text);
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

      this.foods = [];
      // BOOLEAN STOP SEARCH

      return;
    }

    this.foodsSubscription = this.apollo
      .query<any>({
        query: gql`
          query Foods($limit: Int, $house: ID, $name: String) {
            foods(
              limit: $limit
              where: { house: $house, name_contains: $name }
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
        variables: {
          limit: -1,
          house: this.user.current_house.id,
          name: text,
        },
      })
      .subscribe((response: any) => {
        // Subscription will be closed when unsubscribed manually.
        if (this.foodsSubscription.closed) {
          return;
        }

        this.foods = response.data.foods;
        // BOOLEAN STOP SEARCH
      });
  }

  setFood(food: any) {
    this.food = food;
    this.openSearch = false;
  }

  removeFood() {
    this.quantity = 0;
    this.food = null;
  }

  setOpenSearch(value: boolean) {
    this.openSearch = value;
  }

  closeModal(withValue: boolean) {
    if (!withValue) {
      return this.modalController.dismiss();
    }
    return this.modalController.dismiss({
      food: this.food,
      quantity: this.quantity,
    });
  }
}
