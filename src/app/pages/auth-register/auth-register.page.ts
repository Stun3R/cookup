import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { StrapiService } from "src/app/services/strapi/strapi.service";
import { Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { KeyboardResize } from "@capacitor/core";
import { ErrorService } from "src/app/services/error/error.service";
import { Plugins } from "@capacitor/core";
const { Keyboard } = Plugins;

@Component({
  selector: "app-auth-register",
  templateUrl: "./auth-register.page.html",
  styleUrls: ["./auth-register.page.scss"],
})
export class AuthRegisterPage implements OnInit {
  private registerForm: FormGroup;
  private keyboardNone: KeyboardResize = KeyboardResize.None;
  private keyboardNative: KeyboardResize = KeyboardResize.Native;

  constructor(
    private formBuilder: FormBuilder,
    private strapi: StrapiService,
    private router: Router,
    private alertController: AlertController,
    private error: ErrorService
  ) {}

  ngOnInit() {
    Keyboard.setResizeMode({ mode: this.keyboardNone });
    this.registerForm = this.formBuilder.group({
      username: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  ngOnDestroy() {
    Keyboard.setResizeMode({ mode: this.keyboardNative });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.strapi.register(this.registerForm.value).subscribe(async (res) => {
      if (res) {
        this.router.navigate(["/private"]);
      }
    });
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
