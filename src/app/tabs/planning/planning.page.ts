import { Component, OnInit } from "@angular/core";
import * as dayjs from "dayjs";
import { StrapiService } from "src/app/services/strapi/strapi.service";
require("dayjs/locale/fr");
dayjs.locale("fr");
const weekday = require("dayjs/plugin/weekday");
dayjs.extend(weekday);

declare module "dayjs" {
  interface Dayjs {
    weekday(int: number);
  }
}

@Component({
  selector: "app-planning",
  templateUrl: "planning.page.html",
  styleUrls: ["planning.page.scss"],
})
export class PlanningPage implements OnInit {
  private now = dayjs();
  private selectedDate = this.now;
  private days = [];
  private meals = [];
  private types = ["Petit déjeuner", "Déjeuner", "Dîner"];
  private places = {
    fridge: "Frigo",
    freezer: "Congélateur",
    pantry: "Cellier",
  };

  constructor(private strapi: StrapiService) {}

  async ionViewWillEnter() {
    this.getMeals();
  }

  ngOnInit() {
    for (let index = 0; index < 14; index++) {
      this.days.push(this.now.weekday(index));
    }
  }

  async getMeals() {
    const meals = await this.strapi
      .getEntries("meals", {
        when: this.selectedDate.format("YYYY-MM-DD"),
        _sort: "type:ASC",
      })
      .toPromise();
    this.meals = meals || [];
  }

  isSame(day) {
    return this.selectedDate.isSame(day);
  }

  async selectDate(day) {
    if (this.isSame(day)) {
      return;
    }

    this.selectedDate = day;
    await this.getMeals();
  }
}
