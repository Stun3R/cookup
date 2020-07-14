import { Component } from "@angular/core";
import { Apollo } from "apollo-angular";
import { StorageService } from "src/app/services/storage/storage.service";
import { StrapiService } from "src/app/services/strapi/strapi.service";
import { ToastController } from "@ionic/angular";
import { User, StoreConstants, RecipesCategories } from "src/app/interfaces";
import gql from "graphql-tag";
import { Subscription } from "rxjs";

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
  private recipesSubscription: Subscription;
  private openSearch: boolean = false;
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

  async cancelSearch() {
    this.openSearch = false;
    await this.getRecipesByCategory(this.currentCategory);
  }

  searchRecipes($event: { target: { value: string } }) {
    let text = $event.target.value.trim().toLowerCase();
    // BOOLEAN START SEARCH

    // Close any running subscription.
    if (this.recipesSubscription) {
      this.recipesSubscription.unsubscribe();
    }

    if (!text) {
      // Close any running subscription.
      if (this.recipesSubscription) {
        this.recipesSubscription.unsubscribe();
      }

      if (this.openSearch === true) {
        this.recipes[this.currentCategory] = [];
      }

      return;
    }

    this.recipesSubscription = this.apollo
      .query<any>({
        query: gql`
          query RecipesByCategories(
            $house: ID
            $category: String
            $name: String
            $limit: Int
          ) {
            recipes(
              limit: $limit
              where: {
                house: $house
                category: $category
                name_contains: $name
              }
            ) {
              id
              name
              category
              cooking
              preparation
            }
          }
        `,
        variables:
          this.currentCategory === "all"
            ? { house: this.currentHouseId, limit: -1, name: text }
            : {
                house: this.currentHouseId,
                category: this.currentCategory,
                limit: -1,
                name: text,
              },
      })
      .subscribe((response: any) => {
        // Subscription will be closed when unsubscribed manually.
        if (this.recipesSubscription.closed) {
          return;
        }

        this.recipes[this.currentCategory] = response.data.recipes;
        // BOOLEAN STOP SEARCH
      });
  }
}
