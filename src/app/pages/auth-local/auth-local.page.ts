import { Component, OnInit, OnDestroy } from "@angular/core";
import { StrapiService } from "src/app/services/strapi/strapi.service";
import { Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ErrorService } from "src/app/services/error/error.service";
import { Plugins } from "@capacitor/core";
const { Keyboard } = Plugins;
import { KeyboardResize } from "@capacitor/core";

@Component({
  selector: "app-auth-local",
  templateUrl: "./auth-local.page.html",
  styleUrls: ["./auth-local.page.scss"],
})
export class AuthLocalPage implements OnInit, OnDestroy {
  private loginForm: FormGroup;
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
    this.loginForm = this.formBuilder.group({
      identifier: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  ngOnDestroy() {
    Keyboard.setResizeMode({ mode: this.keyboardNative });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.strapi.login(this.loginForm.value).subscribe(async (res) => {
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
