import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { AskHouseComponent } from "./ask-house/ask-house.component";
import { Plugins, StatusBarStyle } from "@capacitor/core";
import { User } from "src/app/interfaces";

const { StatusBar } = Plugins;

@Component({
  selector: "app-houses",
  templateUrl: "./houses.component.html",
  styleUrls: ["./houses.component.scss"],
})
export class HousesComponent implements OnInit {
  @Input() user: User;
  private root = AskHouseComponent;

  constructor() {}

  ngOnInit() {}

  async ionViewWillEnter() {
    await StatusBar.setStyle({ style: StatusBarStyle.Dark });
  }

  async ionViewWillLeave() {
    await StatusBar.setStyle({ style: StatusBarStyle.Light });
  }
}
