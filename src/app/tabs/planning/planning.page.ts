import { Component, OnInit } from "@angular/core";
import * as dayjs from "dayjs";
import { StrapiService } from "src/app/services/strapi/strapi.service";
import { User, StoreConstants } from "src/app/interfaces";
import { StorageService } from "src/app/services/storage/storage.service";
import { Router } from "@angular/router";
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
  private user: User;
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
  private dateMin;

  constructor(
    private strapi: StrapiService,
    private storage: StorageService,
    private router: Router
  ) {}

  async ionViewWillEnter() {
    this.user = await this.storage.getItem(StoreConstants.USER);
    const list_at = this.user.current_house.list_at;
    this.dateMin = dayjs().weekday(list_at).add(7, "day").format("YYYY-MM-DD");
    const days = [];
    for (let index = 0; index <= 14; index++) {
      days.push(this.now.weekday(list_at).add(index, "day"));
    }
    this.days = days;
    await this.getMeals();
  }

  ngOnInit() {}

  async getMeals() {
    const meals = await this.strapi
      .getEntries("meals", {
        when: this.selectedDate.format("YYYY-MM-DD"),
        _sort: "type:ASC",
      })
      .toPromise();
    this.meals = meals || [];
  }

  async navigate(type, id, when) {
    if (type === "aliments" && dayjs(when).isBefore(this.dateMin)) {
      return;
    }
    await this.router.navigate([`/private/planning/${type}/`, id]);
  }

  async deleteAliment(id, parentIndex, childIndex) {
    const aliments = [...this.meals[parentIndex].aliments];
    aliments.splice(childIndex, 1);
    if (aliments.length === 0 && this.meals[parentIndex].recipes.length === 0) {
      const aliment = await this.strapi.deleteEntry("aliments", id).toPromise();
      if (aliment) {
        const meal = await this.strapi
          .deleteEntry("meals", this.meals[parentIndex].id)
          .toPromise();
        if (meal) {
          this.meals.splice(parentIndex, 1);
        }
      }
    } else {
      const meal = await this.strapi
        .updateEntry("meals", this.meals[parentIndex].id, {
          aliments,
        })
        .toPromise();
      if (meal) {
        this.meals[parentIndex].aliments = aliments;
      }
    }
  }
  async deleteRecipe(parentIndex, childIndex) {
    const recipes = [...this.meals[parentIndex].recipes];
    recipes.splice(childIndex, 1);
    if (recipes.length === 0 && this.meals[parentIndex].aliments.length === 0) {
      const meal = await this.strapi
        .deleteEntry("meals", this.meals[parentIndex].id)
        .toPromise();
      if (meal) {
        this.meals.splice(parentIndex, 1);
      }
    } else {
      const meal = await this.strapi
        .updateEntry("meals", this.meals[parentIndex].id, {
          recipes,
        })
        .toPromise();
      if (meal) {
        this.meals[parentIndex].recipes = recipes;
      }
    }
  }

  isBeforeListAt(when) {
    return dayjs(when).isBefore(this.dateMin);
  }

  isSame(day) {
    return this.selectedDate.isSame(day);
  }

  isToday(day) {
    return day.isToday();
  }

  async selectDate(day) {
    if (this.isSame(day)) {
      return;
    }

    this.selectedDate = day;
    await this.getMeals();
  }
}
