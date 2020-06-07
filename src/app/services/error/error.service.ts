import { Injectable } from "@angular/core";
import { ToastController, AlertController } from "@ionic/angular";
import { HttpErrorResponse } from "@angular/common/http";
import { ErrorMode } from "src/app/interfaces";

@Injectable({
  providedIn: "root",
})
export class ErrorService {
  constructor(
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  handleError(error: HttpErrorResponse, mode: ErrorMode) {
    let message: string;
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      message = error.error.message;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      switch (error.error.statusCode) {
        case 401:
          message = "Unauthorized";
          break;
        case 403:
          message = "Forbidden";
          break;
        default:
          message = error.error.message[0].messages[0].id;
      }
    }
    if (mode === ErrorMode.Toast) this.presentToast(message);
    else if (mode === ErrorMode.Alert) this.presentAlert(message);
    // return an observable with a user-facing error message
    return message;
  }

  private async presentToast(message: string) {
    const toast = await this.toastController.create({
      color: "danger",
      message,
      duration: 2000,
    });
    toast.present();
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: "Erreur",
      message,
      buttons: [
        {
          text: "OK",
          cssClass: "info",
        },
      ],
    });

    await alert.present();
  }
}
