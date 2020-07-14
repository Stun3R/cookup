import { Injectable } from "@angular/core";
import { StrapiService } from "src/app/services/strapi/strapi.service";
import { ActivatedRouteSnapshot } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class ShoppingListViewResolverService {
  constructor(private strapi: StrapiService) {}

  async resolve(route: ActivatedRouteSnapshot) {
    let when = route.paramMap.get("when");
    const shoppingList = await this.getShoppingList(when);
    return { shoppingList };
  }

  async getShoppingList(when) {
    const shoppingList = await this.strapi
      .getEntry("shopping-lists", when)
      .toPromise();
    return shoppingList;
  }
}
