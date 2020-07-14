import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as _ from "lodash";
import { AlertController } from "@ionic/angular";
import { parse } from "path";
import { StrapiService } from "src/app/services/strapi/strapi.service";
import { ErrorMode } from "src/app/interfaces";
import * as dayjs from "dayjs";

@Component({
  selector: "app-shoppinglist-view",
  templateUrl: "./shoppinglist-view.page.html",
  styleUrls: ["./shoppinglist-view.page.scss"],
})
export class ShoppinglistViewPage implements OnInit {
  private shoppingList: any;

  constructor(
    private route: ActivatedRoute,
    private alertController: AlertController,
    private strapi: StrapiService
  ) {}

  ngOnInit() {
    if (this.route.snapshot.data["data"]) {
      const { shoppingList } = this.route.snapshot.data["data"];
      this.shoppingList = shoppingList;
    }

    let shoppingItems: any = [...this.shoppingList.shopping_items];
    if (shoppingItems) {
      shoppingItems = _.groupBy(shoppingItems, (item) => {
        return item.food.food_category.name;
      });

      this.shoppingList.shopping_items = shoppingItems;
    }
  }

  get foodCategories() {
    return Object.keys(this.shoppingList.shopping_items) || [];
  }

  async checkFood(item, key, i) {
    if (item.bought === false) {
      await this.presentAlertPrompt(item.id, key, i);
    }
  }

  async presentAlertPrompt(id, key, i) {
    const alert = await this.alertController.create({
      header: "Confirmation d'achat",
      message: "Veuillez renseigner la quantité acheté pour ce produit",
      inputs: [
        {
          name: "quantity",
          type: "number",
          placeholder: "Quantité",
        },
      ],
      buttons: [
        {
          text: "Annuler",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirm Cancel");
          },
        },
        {
          text: "Ok",
          handler: async (value) => {
            const { quantity } = value;

            if (parseFloat(quantity) === NaN) {
              return; // Show error
            }

            const newItem = await this.strapi
              .request("put", `/shopping-items/${id}/buy`, ErrorMode.Toast, {
                body: {
                  quantity: parseFloat(quantity),
                },
              })
              .toPromise();
            this.shoppingList.shopping_items[key][i] = newItem;
          },
        },
      ],
    });

    await alert.present();
  }
}
