import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { SafariViewController } from "@ionic-native/safari-view-controller/ngx";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

import { HttpClientModule } from "@angular/common/http";
import { JwtModule, JWT_OPTIONS } from "@auth0/angular-jwt";
import { UserPreferencesPage } from "./modals/user-preferences/user-preferences.page";
import { StorageService } from "./services/storage/storage.service";

export function jwtOptionsFactory(storage: StorageService) {
  return {
    tokenGetter: async () => {
      return storage.getItem("jwt");
    },
    whitelistedDomains: [
      "localhost:1337",
      "dev-cookup-api.herokuapp.com",
      "cookup-api.herokuapp.com",
    ],
    blacklistedRoutes: [
      "localhost:1337/auth/local",
      "dev-cookup-api.herokuapp.com/auth/local",
      "cookup-api.herokuapp.com/auth/local",
    ],
  };
}

@NgModule({
  declarations: [AppComponent, UserPreferencesPage],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [StorageService],
      },
    }),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    StorageService,
    SafariViewController,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
