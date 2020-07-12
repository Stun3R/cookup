import { Injectable } from "@angular/core";
import { StrapiService } from "src/app/services/strapi/strapi.service";
import { ActivatedRouteSnapshot } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AlimentViewResolverService {
  constructor(private strapi: StrapiService) {}

  async resolve(route: ActivatedRouteSnapshot) {
    let id = route.paramMap.get("id");
    const aliment = await this.getAliment(id);
    return { aliment };
  }

  async getAliment(id) {
    const aliment = await this.strapi.getEntry("aliments", id).toPromise();
    return aliment;
  }
}
