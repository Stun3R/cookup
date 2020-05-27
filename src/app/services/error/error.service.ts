import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ErrorService {
  constructor(private toastController: ToastController) {}

  handleError(error: HttpErrorResponse) {
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
    this.show(message);
    // return an observable with a user-facing error message
    return message;
  }

  private async show(message: string) {
    const toast = await this.toastController.create({
      color: "danger",
      message,
      duration: 2000,
    });
    toast.present();
  }
}
