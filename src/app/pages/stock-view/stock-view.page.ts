import { Component, OnInit } from "@angular/core";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { StrapiService } from "src/app/services/strapi/strapi.service";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-stock-view",
  templateUrl: "./stock-view.page.html",
  styleUrls: ["./stock-view.page.scss"],
})
export class StockViewPage implements OnInit {
  private food: any;
  private updateFoodForm: FormGroup;
  private foodsCategories: any;
  private units = ["ml", "cl", "litre", "mg", "g", "kg"];
  private places = {
    fridge: "Frigo",
    freezer: "Congélateur",
    pantry: "Cellier",
  };
  private isEditable: boolean = false;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private strapi: StrapiService,
    private navController: NavController
  ) {}

  async ngOnInit() {
    if (this.route.snapshot.data["data"]) {
      const { food, foodsCategories } = this.route.snapshot.data["data"];
      this.food = food;
      this.foodsCategories = foodsCategories;
    }
    this.updateFoodForm = this.formBuilder.group({
      food_category: [this.food?.food_category, [Validators.required]],
      quantity: [this.food?.quantity, [Validators.required]],
      unit: [this.food?.unit, [Validators.required]],
      place: [this.food?.place, [Validators.required]],
      expire_at: [this.food?.expire_at],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.updateFoodForm.controls;
  }

  compareFoodCategoryFn(f1: any, f2: any): boolean {
    return f1 && f2 ? f1.id == f2.id : f1 == f2;
  }

  async handleButton() {
    if (!this.isEditable) {
      this.isEditable = true;
      return;
    }
    if (this.updateFoodForm.invalid) {
      return;
    }
    const food = await this.strapi
      .updateEntry("foods", this.food.id.toString(), {
        ...this.updateFoodForm.value,
      })
      .toPromise();
    if (food) {
      this.navController.navigateBack("/private/stocks");
    }
  }
}
