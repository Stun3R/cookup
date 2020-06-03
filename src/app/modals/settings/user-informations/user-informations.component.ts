import { Component, OnInit } from "@angular/core";
import { User } from "src/app/interfaces";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NavParams } from "@ionic/angular";
import { StrapiService } from "src/app/services/strapi/strapi.service";

@Component({
  selector: "app-user-informations",
  templateUrl: "./user-informations.component.html",
  styleUrls: ["./user-informations.component.scss"],
})
export class UserInformationsComponent implements OnInit {
  private user: User;
  private isEditable: boolean = false;
  private updateUserForm: FormGroup;
  private callback;

  constructor(
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    private strapi: StrapiService
  ) {}

  // convenience getter for easy access to form fields
  get f() {
    return this.updateUserForm.controls;
  }

  ngOnInit() {
    this.user = this.navParams.get("user");
    this.callback = this.navParams.get("callback");
    this.updateUserForm = this.formBuilder.group({
      username: [
        this.user?.username,
        [Validators.required, Validators.maxLength(20)],
      ],
      email: [this.user?.email, [Validators.required, Validators.email]],
    });
  }

  async handleButton() {
    if (!this.isEditable) {
      this.isEditable = true;
      return;
    }
    if (this.updateUserForm.invalid) {
      return;
    }
    await this.strapi
      .updateEntry("users", this.user.id.toString(), {
        ...this.updateUserForm.value,
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
