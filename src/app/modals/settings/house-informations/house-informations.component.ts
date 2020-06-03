import { Component, OnInit } from "@angular/core";
import { House } from "src/app/interfaces";
import { NavParams } from "@ionic/angular";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { StrapiService } from "src/app/services/strapi/strapi.service";

@Component({
  selector: "app-house-informations",
  templateUrl: "./house-informations.component.html",
  styleUrls: ["./house-informations.component.scss"],
})
export class HouseInformationsComponent implements OnInit {
  private house: House;
  private isEditable: boolean = false;
  private updateHomeForm: FormGroup;
  private week = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];
  private callback;

  constructor(
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    private strapi: StrapiService
  ) {}

  // convenience getter for easy access to form fields
  get f() {
    return this.updateHomeForm.controls;
  }

  ngOnInit() {
    this.house = this.navParams.get("house");
    this.callback = this.navParams.get("callback");
    this.updateHomeForm = this.formBuilder.group({
      name: [this.house?.name, [Validators.required, Validators.maxLength(20)]],
      list_at: [
        this.house?.list_at,
        [Validators.required, Validators.min(1), Validators.max(7)],
      ],
    });
  }

  async handleButton() {
    if (!this.isEditable) {
      this.isEditable = true;
      return;
    }
    if (this.updateHomeForm.invalid) {
      return;
    }
    await this.strapi
      .updateEntry("houses", this.house.id.toString(), {
        ...this.updateHomeForm.value,
      })
      .toPromise();
    const nav = document.querySelector("ion-nav");
    this.callback(true).then(() => {
      nav.pop();
    });
  }

  cancel() {
    if (this.isEditable) {
      this.isEditable = false;
      return;
    }
    const nav = document.querySelector("ion-nav");
    this.callback(false).then(() => {
      nav.pop();
    });
  }
}
