import { Component, OnInit, Input } from "@angular/core";
import { ModalController, LoadingController } from "@ionic/angular";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { RecipesCategories, User } from "src/app/interfaces";
import { FoodsSearchComponent } from "../foods-search/foods-search.component";
import { StrapiService } from "src/app/services/strapi/strapi.service";
import * as dayjs from "dayjs";
require("dayjs/locale/fr");
dayjs.locale("fr");

var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

@Component({
  selector: "app-recipes-create",
  templateUrl: "./recipes-create.component.html",
  styleUrls: ["./recipes-create.component.scss"],
})
export class RecipesCreateComponent implements OnInit {
  @Input() user: User;
  private createRecipeForm: FormGroup;
  private recipesCategories = RecipesCategories;
  private loading: HTMLIonLoadingElement;
  private places = {
    fridge: "Frigo",
    freezer: "Congélateur",
    pantry: "Cellier",
  };

  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private formBuilder: FormBuilder,
    private strapi: StrapiService
  ) {}

  ngOnInit() {
    this.createRecipeForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.maxLength(140)]],
      category: ["", [Validators.required]],
      preparation: ["00:00:00", [Validators.required]],
      cooking: ["00:00:00", [Validators.required]],
      steps: this.formBuilder.array(
        [],
        [Validators.required, Validators.minLength(1)]
      ),
      ingredients: this.formBuilder.array(
        [],
        [Validators.required, Validators.minLength(1)]
      ),
    });
  }

  get categoriesKey() {
    return Object.keys(this.recipesCategories);
  }

  get steps() {
    return this.createRecipeForm.get("steps") as FormArray;
  }

  get ingredients() {
    return this.createRecipeForm.get("ingredients") as FormArray;
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.createRecipeForm.controls;
  }

  addStep() {
    this.steps.push(this.formBuilder.control("", [Validators.required]));
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
    if (data) {
      this.ingredients.push(
        this.formBuilder.control({
          food: data.food,
          quantity: data.quantity,
        })
      );
    }
  }

  removeStep(index: number) {
    this.steps.removeAt(index);
  }
  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  async handleSubmit() {
    if (this.createRecipeForm.invalid) {
      return;
    }
    await this.presentLoading();
    try {
      this.createRecipeForm.patchValue({
        cooking: dayjs(
          this.createRecipeForm.controls.cooking.value,
          "HH:mm:ss"
        ).format("HH:mm:ss.SSS"),
        preparation: dayjs(
          this.createRecipeForm.controls.preparation.value,
          "HH:mm:ss"
        ).format("HH:mm:ss.SSS"),
      });
      const food = await this.strapi
        .createEntry("recipes", this.createRecipeForm.value)
        .toPromise();
      this.loading.dismiss();
      if (food) {
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
