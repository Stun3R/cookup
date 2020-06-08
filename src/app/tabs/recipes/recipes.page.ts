import { Component } from "@angular/core";
import { Apollo } from "apollo-angular";
import { StorageService } from "src/app/services/storage/storage.service";
import { StrapiService } from "src/app/services/strapi/strapi.service";
import { ToastController } from "@ionic/angular";
import { User, StoreConstants, RecipesCategories } from "src/app/interfaces";
import gql from "graphql-tag";

type Category = "all" | "snack" | "appetizers" | "dish" | "dessert" | "drink";

@Component({
  selector: "app-recipes",
  templateUrl: "recipes.page.html",
  styleUrls: ["recipes.page.scss"],
})
export class RecipesPage {
  private currentCategory: Category = "all";
  private currentHouseId: number;
  private categories = RecipesCategories;
  private recipes = {
    all: [],
    snack: [],
    appetizers: [],
    dish: [],
    dessert: [],
    drink: [],
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
    this.recipes = {
      all: [],
      snack: [],
      appetizers: [],
      dish: [],
      dessert: [],
      drink: [],
    };
    this.currentHouseId = user.current_house.id;
    return await this.getRecipesByCategory(this.currentCategory);
  }

  async getRecipesByCategory(category: Category) {
    const response = await this.apollo
      .query<any>({
        query: gql`
          query RecipesByCategories($house: ID, $category: String) {
            recipes(where: { house: $house, category: $category }) {
              id
              name
              category
              cooking
              preparation
            }
          }
        `,
        variables:
          category === "all"
            ? { house: this.currentHouseId }
            : {
                house: this.currentHouseId,
                category,
              },
      })
      .toPromise();
    if (this.recipes[category].length) {
      return (this.recipes[category] = this.recipes[category].concat(
        response.data.recipes
      ));
    }
    this.recipes[category] = response.data.recipes;
  }

  get CookingTime() {
    return "IN";
  }

  async switchCategory(category: Category) {
    if (this.currentCategory === category) {
      return console.log("REFRESH");
    }
    this.currentCategory = category;
    this.recipes[category] = [];
    await this.getRecipesByCategory(category);
  }

  async deleteRecipe(id: string, index: number) {
    const food: any = await this.strapi
      .deleteEntry("recipes", id.toString())
      .toPromise();
    if (food) {
      await this.presentToast(
        `<strong>Recette supprimée</strong>`,
        "secondary"
      );
      this.recipes[this.currentCategory].splice(index, 1);
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
