import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

import { HttpClientModule } from "@angular/common/http";
import { JwtModule, JWT_OPTIONS } from "@auth0/angular-jwt";
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
        deps: [StorageService],
      },
    }),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    StorageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
