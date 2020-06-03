import { Component, OnInit } from "@angular/core";
import { NavParams } from "@ionic/angular";
import { User } from "src/app/interfaces";
import { QRScanner, QRScannerStatus } from "@ionic-native/qr-scanner/ngx";

@Component({
  selector: "app-house-join",
  templateUrl: "./house-join.component.html",
  styleUrls: ["./house-join.component.scss"],
})
export class HouseJoinComponent implements OnInit {
  private callback;
  private user: User;
  private showCamera: boolean = false;
  private textScanned: string = null;

  constructor(private navParams: NavParams, private qrScanner: QRScanner) {}

  ngOnInit() {
    this.user = this.navParams.get("user");
    this.callback = this.navParams.get("callback");
  }

  cancel() {
    const nav = document.querySelector("ion-nav");
    this.callback(false).then(() => {
      nav.pop();
    });
  }

  scanCode() {
    this.showCamera = true;
    // Optionally request the permission early
    this.qrScanner
      .prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // start scanning
          console.log("Scan en cours..." + JSON.stringify(status));
          const scanSub = this.qrScanner.scan().subscribe((text: any) => {
            console.log("Scanned something", text);
            this.textScanned = text.result;
            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
            this.showCamera = false;
          });
        } else if (status.denied) {
          // camera permission was permanently denied
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log("Error is", e));
  }

  closeCamera() {
    this.showCamera = false;
    this.qrScanner.hide(); // hide camera preview
    this.qrScanner.destroy();
  }
}
