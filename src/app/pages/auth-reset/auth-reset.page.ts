import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MustMatch } from "src/app/helpers/forms/must-match.validator";
import { StrapiService } from "src/app/services/strapi/strapi.service";

@Component({
  selector: "app-auth-reset",
  templateUrl: "./auth-reset.page.html",
  styleUrls: ["./auth-reset.page.scss"],
})
export class AuthResetPage implements OnInit {
  code: string;
  resetForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private strapi: StrapiService
  ) {}

  ngOnInit() {
    this.code = this.route.snapshot.paramMap.get("code");
    this.resetForm = this.formBuilder.group(
      {
        code: [this.code],
        password: ["", [Validators.required, Validators.minLength(6)]],
        passwordConfirmation: ["", [Validators.required]],
      },
      {
        validator: MustMatch("password", "passwordConfirmation"),
      }
    );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.resetForm.controls;
  }

  onSubmit() {
    if (this.resetForm.invalid) {
      return;
    }
    const values: {
      code: string;
      password: string;
      passwordConfirmation: string;
    } = this.resetForm.value;

    this.strapi
      .resetPassword(values.code, values.password, values.passwordConfirmation)
      .subscribe();
  }
}
