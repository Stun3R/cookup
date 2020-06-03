import { Component, OnInit } from "@angular/core";
import { House } from "src/app/interfaces";
import { NavParams } from "@ionic/angular";

@Component({
  selector: "app-house-qrcode",
  templateUrl: "./house-qrcode.component.html",
  styleUrls: ["./house-qrcode.component.scss"],
})
export class HouseQrcodeComponent implements OnInit {
  private house: House;
  private callback;
  private elementType: "url" | "canvas" | "img" = "img";

  constructor(private navParams: NavParams) {}

  ionViewWillEnter() {
    this.callback = this.navParams.get("callback");
    this.house = this.navParams.get("house");
  }

  ngOnInit() {}

  cancel() {
    const nav = document.querySelector("ion-nav");
    this.callback(false).then(() => {
      nav.pop();
    });
  }
}
