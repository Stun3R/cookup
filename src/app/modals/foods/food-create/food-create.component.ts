import { Component, OnInit, Input } from "@angular/core";
import { ModalController, LoadingController } from "@ionic/angular";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { StrapiService } from "src/app/services/strapi/strapi.service";

@Component({
  selector: "app-food-create",
  templateUrl: "./food-create.component.html",
  styleUrls: ["./food-create.component.scss"],
})
export class FoodCreateComponent implements OnInit {
  @Input() product: any;
  @Input() foodsCategories: any;
  private createFoodForm: FormGroup;
  private units = ["ml", "cl", "litre", "mg", "g", "kg"];
  private places = [
    { ref: "fridge", name: "Frigo" },
    { ref: "freezer", name: "Congélateur" },
    { ref: "pantry", name: "Cellier" },
  ];
  private loading: HTMLIonLoadingElement;

  constructor(
    private loadingController: LoadingController,
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    private strapi: StrapiService
  ) {}

  async ngOnInit() {
    this.createFoodForm = this.formBuilder.group({
      name: [
        this.product?.name,
        [Validators.required, Validators.maxLength(40)],
      ],
      image: [this.product?.imageUrl, [Validators.required]],
      food_category: [this.foodsCategories[0], [Validators.required]],
      quantity: [this.product?.quantity, [Validators.required]],
      unit: [this.product?.unit, [Validators.required]],
      place: ["", [Validators.required]],
      nutriments: [this.product?.nutriments, [Validators.required]],
      barcode: [this.product?.barcode, [Validators.required]],
      expire_at: [null],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.createFoodForm.controls;
  }

  compareFoodCategoryFn(f1: any, f2: any): boolean {
    return f1 && f2 ? f1.id == f2.id : f1 == f2;
  }

  async closeModal() {
    await this.modalController.dismiss();
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
    this.foodsCategories = response.data.foodsCategories;
  }

  async handleSubmit() {
    if (this.createFoodForm.invalid) {
      return;
    }
    await this.presentLoading();
    const food = await this.strapi
      .createEntry("foods", this.createFoodForm.value)
      .toPromise();
    this.loading.dismiss();
    if (food) {
      this.closeModal();
    }
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: "Traitement en cours...",
      spinner: "bubbles",
    });
    await this.loading.present();
  }
}
