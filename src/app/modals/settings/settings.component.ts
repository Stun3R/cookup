import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { UserPreferencesComponent } from "./user-preferences/user-preferences.component";
import { Plugins, StatusBarStyle } from "@capacitor/core";
import { User } from "src/app/interfaces";

const { StatusBar } = Plugins;

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  @Input() user: User;
  private root = UserPreferencesComponent;

  constructor() {}

  ngOnInit() {}

  ionViewWillLeave() {
    StatusBar.setStyle({ style: StatusBarStyle.Light });
  }
}
