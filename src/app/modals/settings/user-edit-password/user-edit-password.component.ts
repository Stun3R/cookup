import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { User } from "src/app/interfaces";
import { StrapiService } from "src/app/services/strapi/strapi.service";
import { NavParams } from "@ionic/angular";
import { Apollo } from "apollo-angular";
import { StorageService } from "src/app/services/storage/storage.service";
import { MustMatch } from "src/app/helpers/forms/must-match.validator";

@Component({
  selector: "app-user-edit-password",
  templateUrl: "./user-edit-password.component.html",
  styleUrls: ["./user-edit-password.component.scss"],
})
export class UserEditPasswordComponent implements OnInit {
  private updatePasswordForm: FormGroup;
  private user: User;
  private callback;

  constructor(
    private formBuilder: FormBuilder,
    private strapi: StrapiService,
    private navParams: NavParams
  ) {}

  // convenience getter for easy access to form fields
  get f() {
    return this.updatePasswordForm.controls;
  }

  async onSubmit() {
    if (this.updatePasswordForm.invalid) {
      return;
    }
    const house: any = await this.strapi
      .updateEntry(
        "users",
        this.user.id.toString(),
        this.updatePasswordForm.value
      )
      .toPromise();
    if (house) {
      await this.strapi
        .updateEntry("users", this.user.id.toString(), {
          password: this.updatePasswordForm.value.password,
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
    this.updatePasswordForm = this.formBuilder.group(
      {
        password: ["", [Validators.required, Validators.minLength(6)]],
        passwordConfirmation: ["", [Validators.required]],
      },
      {
        validator: MustMatch("password", "passwordConfirmation"),
      }
    );
  }

  cancel() {
    const nav = document.querySelector("ion-nav");
    this.callback(false).then(() => {
      nav.pop();
    });
  }
}
