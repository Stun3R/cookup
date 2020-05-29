import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { StrapiService } from "src/app/services/strapi/strapi.service";
import { Router } from "@angular/router";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-auth-register",
  templateUrl: "./auth-register.page.html",
  styleUrls: ["./auth-register.page.scss"],
})
export class AuthRegisterPage implements OnInit {
  private registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private strapi: StrapiService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ["", Validators.required],
      identifier: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ["OK"],
    });

    await alert.present();
  }
}
