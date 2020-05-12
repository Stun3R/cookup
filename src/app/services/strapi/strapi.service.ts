import { Injectable } from "@angular/core";
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { HttpClient } from "@angular/common/http";
import { Platform, NavController } from "@ionic/angular";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable, BehaviorSubject, from, of } from "rxjs";
import { switchMap, map, take } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { Authentication, Provider, storageConfig } from "../../interfaces";

const helper = new JwtHelperService();

@Injectable({
  providedIn: "root",
})
export class StrapiService {
  public apiUrl = environment.apiUrl;
  public store: storageConfig;
  public user: Observable<any>;
  private userData = new BehaviorSubject(null);

  constructor(
    private nativeStorage: NativeStorage,
    private http: HttpClient,
    private plt: Platform,
    private router: Router,
    private navController: NavController
  ) {
    this.store = {
      key: "jwt",
    };
    this.loadStoredToken();
  }

  loadStoredToken() {
    let platformObs = from(this.plt.ready());
    this.user = platformObs.pipe(
      switchMap(() => {
        return this.nativeStorage.getItem(this.store.key);
      }),
      map((token) => {
        if (token) {
          let decoded = helper.decodeToken(token);
          this.userData.next(decoded);
          return true;
        } else {
          return null;
        }
      })
    );
  }

  /**
   * Login by getting an authentication token.
   * @param identifier Can either be an email or a username.
   * @param password
   */
  login(credentials: {
    identifier: string;
    password: string;
  }): Observable<any> {
    return this.clearToken().pipe(
      switchMap(() => {
        return this.http
          .post<Authentication>(`${this.apiUrl}/auth/local`, credentials)
          .pipe(
            take(1),
            map((res) => {
              return res.jwt;
            }),
            switchMap((token) => {
              let decoded = helper.decodeToken(token);
              this.userData.next(decoded);
              let storageObs = this.setToken(token);
              return storageObs;
            })
          );
      })
    );
  }

  /**
   * Retrieve the connect provider URL
   * @param provider
   */
  getProviderAuthenticationUrl(provider: Provider): string {
    return `${this.apiUrl}/connect/${provider}`;
  }

  /**
   * Authenticate the user with the token present on the URL (for browser) or in `params` (on Node.js)
   * @param provider
   * @param params
   */
  authenticateProvider(provider: Provider, params: any): Observable<any> {
    return this.clearToken().pipe(
      switchMap(() => {
        return this.http
          .get<Authentication>(`${this.apiUrl}/auth/${provider}/callback`, {
            params: <any>params,
          })
          .pipe(
            take(1),
            map((res) => {
              return res.jwt;
            }),
            switchMap((token) => {
              let decoded = helper.decodeToken(token);
              this.userData.next(decoded);
              let storageObs = this.setToken(token);
              return storageObs;
            })
          );
      })
    );
  }

  getUser() {
    return this.userData.getValue();
  }

  async logout() {
    await this.clearToken().toPromise();
    this.navController.navigateBack(["/auth"]);
    this.userData.next(null);
  }

  setToken(token: string): Observable<any> {
    return from(this.nativeStorage.setItem(this.store.key, token));
  }

  clearToken(): Observable<any> {
    return from(this.nativeStorage.remove(this.store.key));
  }
}
