import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class StockViewResolverService implements Resolve<any> {
  constructor(private apollo: Apollo) {}

  async resolve(route: ActivatedRouteSnapshot) {
    let id = route.paramMap.get("id");
    const food = await this.getFood(id);
    const foodsCategories = await this.getFoodsCategories();
    return { food, foodsCategories };
  }

  async getFood(id: string) {
    const response = await this.apollo
      .query<any>({
        query: gql`
          query Food($id: ID!) {
            food(id: $id) {
              id
              image
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
              nutriments
            }
          }
        `,
        variables: {
          id,
        },
      })
      .toPromise();
    if (response.data.food === null) {
      console.log("NOT FOUND");
    }
    return response.data.food;
  }

  async getFoodsCategories() {
    const response = await this.apollo
      .query<any>({
        query: gql`
          query FoodsCategories($limit: Int) {
            foodsCategories(limit: $limit) {
              id
              name
              icon
            }
          }
        `,
        variables: {
          limit: -1,
        },
      })
      .toPromise();
    return response.data.foodsCategories;
  }
}
