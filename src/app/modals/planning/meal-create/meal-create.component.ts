import { Component, OnInit, Input } from "@angular/core";
import { User } from "src/app/interfaces";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ModalController, LoadingController } from "@ionic/angular";
import { StrapiService } from "src/app/services/strapi/strapi.service";
import { FoodsSearchComponent } from "../../recipes/foods-search/foods-search.component";
import * as dayjs from "dayjs";
import { RecipesSearchComponent } from "../recipes-search/recipes-search.component";
import { AtleastOne } from "src/app/helpers/forms/atleast-one.validator";

@Component({
  selector: "app-meal-create",
  templateUrl: "./meal-create.component.html",
  styleUrls: ["./meal-create.component.scss"],
})
export class MealCreateComponent implements OnInit {
  @Input() user: User;
  private createMealForm: FormGroup;
  private loading: HTMLIonLoadingElement;
  private types = ["Petit déjeuner", "Déjeuner", "Dîner"];
  private places = {
    0: "Frigo",
    1: "Congélateur",
    2: "Cellier",
  };

  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private formBuilder: FormBuilder,
    private strapi: StrapiService
  ) {}

  ngOnInit() {
    this.createMealForm = this.formBuilder.group(
      {
        when: [dayjs().toString()],
        type: [0, [Validators.required]],
        recipes: this.formBuilder.array([]),
        aliments: this.formBuilder.array([]),
      },
      {
        validator: AtleastOne("recipes", "aliments"),
      }
    );
  }

  get recipes() {
    return this.createMealForm.get("recipes") as FormArray;
  }

  get aliments() {
    return this.createMealForm.get("aliments") as FormArray;
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.createMealForm.controls;
  }

  async addRecipe() {
    const modal = await this.modalController.create({
      component: RecipesSearchComponent,
      componentProps: {
        user: this.user,
      },
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(),
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      this.recipes.push(this.formBuilder.control(data.recipe));
    }
  }

  async addIngredient() {
    const modal = await this.modalController.create({
      component: FoodsSearchComponent,
      componentProps: {
        user: this.user,
      },
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(),
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    console.log(data);
    if (data) {
      this.aliments.push(
        this.formBuilder.control({
          food: data.food,
          quantity: data.quantity,
        })
      );
    }
  }

  removeRecipe(index: number) {
    this.recipes.removeAt(index);
  }
  removeIngredient(index: number) {
    this.aliments.removeAt(index);
  }

  async handleSubmit() {
    if (this.createMealForm.invalid) {
      return;
    }
    await this.presentLoading();
    try {
      this.createMealForm.patchValue({
        when: dayjs(this.createMealForm.controls.when.value).toISOString(),
      });
      console.log(this.createMealForm.value);
      const meal = await this.strapi
        .createEntry("meals", this.createMealForm.value)
        .toPromise();
      this.loading.dismiss();
      if (meal) {
        this.closeModal();
      }
    } catch (err) {
      console.error(err);
      this.loading.dismiss();
    }
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: "Traitement en cours...",
      spinner: "bubbles",
    });
    await this.loading.present();
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
