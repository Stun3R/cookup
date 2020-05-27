import { Component, OnInit } from "@angular/core";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { StrapiService } from "src/app/services/strapi/strapi.service";

@Component({
  selector: "app-auth-forgot",
  templateUrl: "./auth-forgot.page.html",
  styleUrls: ["./auth-forgot.page.scss"],
})
export class AuthForgotPage implements OnInit {
  private forgotForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private strapi: StrapiService
  ) {}

  ngOnInit() {
    this.forgotForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotForm.controls;
  }

  onSubmit() {
    if (this.forgotForm.invalid) {
      return;
    }
    this.strapi.forgotPassword(this.forgotForm.get("email").value).subscribe();
  }
}
