import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { ActivatedRouteSnapshot } from "@angular/router";
import gql from "graphql-tag";

@Injectable({
  providedIn: "root",
})
export class RecipeViewResolverService {
  constructor(private apollo: Apollo) {}

  async resolve(route: ActivatedRouteSnapshot) {
    let id = route.paramMap.get("id");
    const recipe = await this.getRecipe(id);
    return { recipe };
  }

  async getRecipe(id: string) {
    const response = await this.apollo
      .query<any>({
        query: gql`
          query Recipe($id: ID!) {
            recipe(id: $id) {
              id
              name
              category
              cooking
              preparation
              steps
              ingredients {
                id
                quantity
                food {
                  id
                  name
                  place
                  unit
                  food_category {
                    icon
                  }
                }
              }
            }
          }
        `,
        variables: {
          id,
        },
      })
      .toPromise();
    if (response.data.recipe === null) {
      console.log("NOT FOUND");
    }
    return response.data.recipe;
  }
}
