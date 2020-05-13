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
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { JwtModule, JWT_OPTIONS } from "@auth0/angular-jwt";

export function jwtOptionsFactory(nativeStorage) {
  return {
    tokenGetter: async () => {
      return nativeStorage.getItem("jwt");
    },
    whitelistedDomains: [
      "http://localhost:1337",
      "https://dev-cookup-api.herokuapp.com/",
      "https://cookup-api.herokuapp.com/",
    ],
    blacklistedRoutes: [
      "http://localhost:1337/auth/local",
      "https://dev-cookup-api.herokuapp.com/auth/local",
      "https://cookup-api.herokuapp.com/auth/local",
    ],
  };
}

@NgModule({
  declarations: [AppComponent],
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
        deps: [NativeStorage],
      },
    }),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    NativeStorage,
    SafariViewController,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
