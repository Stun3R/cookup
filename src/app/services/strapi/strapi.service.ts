import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Platform, NavController } from "@ionic/angular";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable, BehaviorSubject, from, of, throwError } from "rxjs";
import { switchMap, map, take, catchError } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import {
  Authentication,
  Provider,
  storageConfig,
  ErrorMode,
  StoreConstants,
  User,
} from "../../interfaces";
import { ErrorService } from "../error/error.service";
import { StorageService } from "../storage/storage.service";

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
    private storage: StorageService,
    private http: HttpClient,
    private plt: Platform,
    private navController: NavController,
    private error: ErrorService
  ) {
    this.loadStoredToken();
  }

  loadStoredToken() {
    let platformObs = from(this.plt.ready());
    this.user = platformObs.pipe(
      switchMap(() => {
        return this.storage.getItem(StoreConstants.JWT);
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

  request<T>(method: string, url: string, mode: ErrorMode, options?: Object) {
    return this.http.request<T>(method, `${this.apiUrl}${url}`, options).pipe(
      catchError((e) => {
        let message = this.error.handleError(e, mode);
        return throwError(message);
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
        return this.request<Authentication>(
          "post",
          "/auth/local",
          ErrorMode.Alert,
          { body: credentials }
        ).pipe(
          take(1),
          switchMap(async (res: Authentication) => {
            let decoded = helper.decodeToken(res.jwt);
            this.userData.next(decoded);
            let storageObs = this.setToken(res.jwt);
            return storageObs;
          })
        );
      })
    );
  }

  /**
   * Sends an email to a user with the link of your reset password page.
   * This link contains an URL param code which is required to reset user password.
   * Received link url format https://my-domain.com/rest-password?code=privateCode.
   * @param email
   * @param url Link that user will receive.
   */
  forgotPassword(email: string): Observable<any> {
    return this.clearToken().pipe(
      switchMap(() => {
        return this.request<Object>(
          "post",
          "/auth/forgot-password",
          ErrorMode.Alert,
          {
            body: { email },
          }
        ).pipe(
          switchMap(() => {
            return this.navController.navigateRoot(["/auth/local"]);
          })
        );
      })
    );
  }

  /**
   * Reset the user password.
   * @param code Is the url params received from the email link (see forgot password).
   * @param password
   * @param passwordConfirmation
   */
  resetPassword(
    code: string,
    password: string,
    passwordConfirmation: string
  ): Observable<any> {
    return this.clearToken().pipe(
      switchMap(() => {
        return this.request<Object>(
          "post",
          "/auth/reset-password",
          ErrorMode.Toast,
          {
            body: {
              code,
              password,
              passwordConfirmation,
            },
          }
        ).pipe(
          switchMap(() => {
            return this.navController.navigateRoot(["/auth/local"]);
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
        return this.request<Authentication>(
          "get",
          `/auth/${provider}/callback`,
          ErrorMode.Alert,
          {
            params: <any>params,
          }
        ).pipe(
          take(1),
          map((res: Authentication) => {
            return res.jwt;
          }),
          switchMap((token) => {
            let decoded = helper.decodeToken(token);
            this.userData.next(decoded);
            let storageObs = this.setToken(token);
            return storageObs;
          }),
          catchError((e) => {
            let error = this.error.handleError(e, ErrorMode.Alert);
            return throwError(error);
          })
        );
      })
    );
  }

  /**
   * List entries
   * @param contentTypePluralized
   * @param params Filter and order queries.
   */
  getEntries(
    contentTypePluralized: string,
    params?: HttpParams
  ): Observable<Object[]> {
    return this.request<Object[]>(
      "get",
      `/${contentTypePluralized}`,
      ErrorMode.Toast,
      { params }
    );
  }

  /**
   * Get the total count of entries with the provided criteria
   * @param contentType
   * @param params Filter and order queries.
   */
  public getEntryCount(
    contentTypePluralized: string,
    params?: HttpParams
  ): Observable<Object> {
    return this.request<Object>(
      "get",
      `/${contentTypePluralized}/count`,
      ErrorMode.Toast,
      {
        params,
      }
    );
  }

  /**
   * Get a specific entry
   * @param contentTypePluralized Type of entry pluralized
   * @param id ID of entry
   */
  public getEntry(
    contentTypePluralized: string,
    id: string
  ): Observable<Object> {
    return this.request<Object>(
      "get",
      `/${contentTypePluralized}/${id}`,
      ErrorMode.Toast
    );
  }

  /**
   * Create data
   * @param contentTypePluralized Type of entry pluralized
   * @param data New entry
   */
  public createEntry(
    contentTypePluralized: string,
    body: Object
  ): Observable<Object> {
    return this.request<Object>(
      "post",
      `/${contentTypePluralized}`,
      ErrorMode.Toast,
      {
        body,
      }
    );
  }

  /**
   * Update data
   * @param contentTypePluralized Type of entry pluralized
   * @param id ID of entry
   * @param data
   */
  public updateEntry<T>(
    contentTypePluralized: string,
    id: string,
    body: Object
  ): Observable<T> {
    return this.request<T>(
      "put",
      `/${contentTypePluralized}/${id}`,
      ErrorMode.Toast,
      { body }
    );
  }

  /**
   * Delete an entry
   * @param contentTypePluralized Type of entry pluralized
   * @param id ID of entry
   */
  public deleteEntry(
    contentTypePluralized: string,
    id: string
  ): Observable<Object> {
    return this.request(
      "delete",
      `/${contentTypePluralized}/${id}`,
      ErrorMode.Toast
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

  setUser(user: User): Observable<any> {
    return from(this.storage.setItem(StoreConstants.USER, user));
  }

  clearUser(): Observable<any> {
    return from(this.storage.removeItem(StoreConstants.USER));
  }

  setToken(token: string): Observable<any> {
    return from(this.storage.setItem(StoreConstants.JWT, token));
  }

  clearToken(): Observable<any> {
    return from(this.storage.clear());
  }
}
