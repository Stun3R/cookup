import { Component } from "@angular/core";
import { StrapiService } from "src/app/services/strapi/strapi.service";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  constructor(private strapi: StrapiService) {}

  async logout() {
    await this.strapi.logout();
  }
}
