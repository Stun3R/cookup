import { Component, OnInit, Input } from "@angular/core";
import { User, RecipesCategories } from "src/app/interfaces";
import { Subscription } from "rxjs";
import { ModalController } from "@ionic/angular";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";

@Component({
  selector: "app-recipes-search",
  templateUrl: "./recipes-search.component.html",
  styleUrls: ["./recipes-search.component.scss"],
})
export class RecipesSearchComponent implements OnInit {
  @Input() user: User;
  private recipes: any;
  private recipe: any;
  private recipesSubscription: Subscription;
  private openSearch: boolean = false;

  constructor(
    private modalController: ModalController,
    private apollo: Apollo
  ) {}

  ngOnInit() {}

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

      this.recipes = [];
      // BOOLEAN STOP SEARCH

      return;
    }

    this.recipesSubscription = this.apollo
      .query<any>({
        query: gql`
          query Recipes($limit: Int, $house: ID, $name: String) {
            recipes(
              limit: $limit
              where: { house: $house, name_contains: $name }
            ) {
              id
              name
              category
              cooking
              preparation
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
        if (this.recipesSubscription.closed) {
          return;
        }

        this.recipes = response.data.recipes;
        // BOOLEAN STOP SEARCH
      });
  }

  setRecipe(recipe: any) {
    this.recipe = recipe;
    this.openSearch = false;
  }

  removeRecipe() {
    this.recipe = null;
  }

  setOpenSearch(value: boolean) {
    this.openSearch = value;
  }

  closeModal(withValue: boolean) {
    if (!withValue) {
      return this.modalController.dismiss();
    }
    return this.modalController.dismiss({
      recipe: this.recipe,
    });
  }
}
