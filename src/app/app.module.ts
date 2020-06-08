import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

import { QRScanner } from "@ionic-native/qr-scanner/ngx";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";

import { ApolloModule, Apollo } from "apollo-angular";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import { ApolloLink, split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { getMainDefinition } from "apollo-utilities";

import { QRCodeModule } from "angularx-qrcode";
import { HttpClientModule } from "@angular/common/http";
import { JwtModule, JWT_OPTIONS } from "@auth0/angular-jwt";
import { StorageService } from "./services/storage/storage.service";
import { environment } from "src/environments/environment";
import { StoreConstants } from "./interfaces";

import { IonicSelectableModule } from "ionic-selectable";

export function jwtOptionsFactory(storage: StorageService) {
  return {
    tokenGetter: async () => {
      return storage.getItem(StoreConstants.JWT);
    },
    whitelistedDomains: [
      "localhost:1337",
      "192.168.1.96:1337",
      "dev-cookup-api.herokuapp.com",
      "cookup-api.herokuapp.com",
    ],
    blacklistedRoutes: [
      "localhost:1337/auth/local",
      "192.168.1.96:1337/auth/local",
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
    ApolloModule,
    QRCodeModule,
    IonicSelectableModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    StorageService,
    QRScanner,
    BarcodeScanner,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private apollo: Apollo, private storage: StorageService) {
    // Creating new HttpLink for Apollo Client
    const http = new HttpLink({
      uri: `${environment.apiUrl}/graphql`,
    });

    // authContext to set Authorization token for every request sent from client
    const authContext = setContext(async (request, previousContext) => {
      // Getting the token from the session service
      const token = await this.storage.getItem(StoreConstants.JWT);

      // return {} if token is not set yet
      if (!token) {
        return {};
      }

      // Set Authorization headers with token
      return {
        headers: { Authorization: `Bearer ${token}` },
      };
    });

    // Error handling for GraphQL client
    const error = onError(
      ({ graphQLErrors, networkError, response, operation }) => {
        if (graphQLErrors) {
          graphQLErrors.map((error) => {
            console.log("tamer", error);
            // Destroy the session if INVALID_TOKEN receieved from the server
            // Forcing user to login again
            /*             if (type === "INVALID_TOKEN") {
              this.session.destroy();
            }

            // Forcing user to login again if token is UNAUTHENTICATED
            if (type === "UNAUTHENTICATED") {
              this.session.destroy();
            }

            // Loggin the GraphQL errors on the console
            console.log(
              `[GraphQL Error]: Type: ${type}, Message: ${message}`,
              path
            ); */
          });
        }

        // Login the Network errors
        if (networkError) {
          console.log(`[Network Error]:`, networkError);
        }
      }
    );

    /*     // afterwareLink, Apollo link
    const afterwareLink = new ApolloLink((operation, forward) => {
      // tap to the forward reuqest operation
      return forward(operation).map((response) => {
        // get the response headers
        const {
          response: { headers },
        } = operation.getContext();

        // check if headers recieved
        if (headers) {
          // get the token from the response header
          const _token = headers.get("Authorization");

          // check if token is not null
          if (_token && _token !== "null") {
            // get playload for of the token
            const payload = getPayload(_token);

            // set the new token into the session
            this.session.setToken(_token);
          }
        }

        return response;
      });
    }); */

    const link = ApolloLink.from([authContext, error, http]);

    // creating the final Apollo client link with all the parameters
    apollo.create({
      link: link,
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: "no-cache",
          errorPolicy: "ignore",
        },
        query: {
          fetchPolicy: "no-cache",
          errorPolicy: "all",
        },
      },
    });
  }
}
