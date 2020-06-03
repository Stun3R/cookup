import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { StrapiService } from "src/app/services/strapi/strapi.service";
import { User, StoreConstants } from "src/app/interfaces";
import { NavParams } from "@ionic/angular";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { StorageService } from "src/app/services/storage/storage.service";

@Component({
  selector: "app-house-create",
  templateUrl: "./house-create.component.html",
  styleUrls: ["./house-create.component.scss"],
})
export class HouseCreateComponent implements OnInit {
  private createHomeForm: FormGroup;
  private user: User;
  private callback;

  constructor(
    private formBuilder: FormBuilder,
    private strapi: StrapiService,
    private navParams: NavParams,
    private apollo: Apollo,
    private storage: StorageService
  ) {}

  // convenience getter for easy access to form fields
  get f() {
    return this.createHomeForm.controls;
  }

  async onSubmit() {
    if (this.createHomeForm.invalid) {
      return;
    }
    const house: any = await this.strapi
      .createEntry("houses", this.createHomeForm.value)
      .toPromise();
    if (house) {
      // TODO: Strapi Custom Controller to update user in api with current house
      await this.strapi
        .updateEntry("users", this.user.id.toString(), {
          current_house: house.id,
        })
        .toPromise();
      const nav = document.querySelector("ion-nav");
      this.callback(true).then(() => {
        nav.pop();
      });
    }
  }

  ngOnInit() {
    this.callback = this.navParams.get("callback");
    this.user = this.navParams.get("user");
    this.createHomeForm = this.formBuilder.group({
      users: [[this.user.id], Validators.required],
      name: ["", [Validators.required, Validators.maxLength(20)]],
      list_at: [1, [Validators.required, Validators.min(1), Validators.max(7)]],
    });
  }

  cancel() {
    const nav = document.querySelector("ion-nav");
    this.callback(false).then(() => {
      nav.pop();
    });
  }
}
