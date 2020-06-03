import { Component, OnInit } from "@angular/core";
import { House } from "src/app/interfaces";
import { NavParams } from "@ionic/angular";

@Component({
  selector: "app-house-members",
  templateUrl: "./house-members.component.html",
  styleUrls: ["./house-members.component.scss"],
})
export class HouseMembersComponent implements OnInit {
  private house: House;
  private callback;

  constructor(private navParams: NavParams) {}

  ngOnInit() {
    this.callback = this.navParams.get("callback");
    this.house = this.navParams.get("house");
  }

  cancel() {
    const nav = document.querySelector("ion-nav");
    this.callback(false).then(() => {
      nav.pop();
    });
  }
}
