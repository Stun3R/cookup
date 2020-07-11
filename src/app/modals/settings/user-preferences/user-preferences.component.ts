import { Component, OnInit, Input } from "@angular/core";
import { Plugins, StatusBarStyle } from "@capacitor/core";
import { User, StoreConstants, House, ErrorMode } from "src/app/interfaces";
import { ModalController, NavParams, LoadingController } from "@ionic/angular";
import { StrapiService } from "src/app/services/strapi/strapi.service";
import { HouseCreateComponent } from "../house-create/house-create.component";
import { StorageService } from "src/app/services/storage/storage.service";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { HouseMembersComponent } from "../house-members/house-members.component";
import { HouseInformationsComponent } from "../house-informations/house-informations.component";
import { UserInformationsComponent } from "../user-informations/user-informations.component";
import { UserEditPasswordComponent } from "../user-edit-password/user-edit-password.component";
import { HouseQrcodeComponent } from "../house-qrcode/house-qrcode.component";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";

const { StatusBar } = Plugins;

@Component({
  selector: "app-user-preferences",
  templateUrl: "./user-preferences.component.html",
  styleUrls: ["./user-preferences.component.scss"],
})
export class UserPreferencesComponent implements OnInit {
  private user: User;
  private isLocal: boolean;
  private currentHouse: House;
  private showSelect: boolean = true;
  private refresh: boolean = null;
  private loading;

  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private strapi: StrapiService,
    private storage: StorageService,
    private apollo: Apollo,
    private barcodeScanner: BarcodeScanner
  ) {}

  async ngOnInit() {}

  myCallbackFunction = (_params) => {
    return new Promise((resolve, reject) => {
      this.refresh = _params;
      resolve();
    });
  };

  async ionViewWillEnter() {
    if (this.refresh === false) {
      return;
    }
    await StatusBar.setStyle({ style: StatusBarStyle.Dark });
    const id = this.strapi.getUser().id;
    const response = await this.apollo
      .query<{ user: User }>({
        query: gql`
          query User($id: ID!) {
            user(id: $id) {
              id
              username
              email
              provider
              current_house {
                id
                name
                list_at
                uuid
                users {
                  id
                  username
                  email
                }
              }
              houses {
                id
                name
                uuid
              }
            }
          }
        `,
        variables: {
          id: id,
        },
      })
      .toPromise();
    this.user = response.data.user;
    await this.storage.setItem(StoreConstants.USER, this.user);
    this.isLocal = this.user.provider === "local";
    this.currentHouse = this.user.current_house;
  }

  async ionViewWillLeave() {
    await StatusBar.setStyle({ style: StatusBarStyle.Light });
  }

  async closeModal() {
    await this.modalController.dismiss({
      refresh: this.refresh ? this.refresh : true,
    });
  }

  async showHouseQRCode() {
    const nav = document.querySelector("ion-nav");
    await nav.push(HouseQrcodeComponent, {
      house: this.currentHouse,
      callback: this.myCallbackFunction,
    });
  }

  async showHouseInformations() {
    const nav = document.querySelector("ion-nav");
    await nav.push(HouseInformationsComponent, {
      house: this.currentHouse,
      callback: this.myCallbackFunction,
    });
  }

  async showHouseMembers() {
    const nav = document.querySelector("ion-nav");
    await nav.push(HouseMembersComponent, {
      house: this.currentHouse,
      callback: this.myCallbackFunction,
    });
  }

  async onHouseChange() {
    if (this.currentHouse !== this.user.current_house) {
      const user: User = await this.strapi
        .updateEntry<User>("users", this.user.id.toString(), {
          current_house: this.currentHouse.id,
        })
        .toPromise();
      if (user) {
        this.user.current_house = {
          id: user.current_house.id,
          name: user.current_house.name,
          list_at: user.current_house.list_at,
          uuid: user.current_house.uuid,
        };
        this.currentHouse = this.user.current_house;
        await this.storage.setItem(StoreConstants.USER, this.user);
      }
      return;
    }
  }

  compareHouseFn(h1: House, h2: House): boolean {
    return h1 && h2 ? h1.id == h2.id : h1 == h2;
  }

  async leaveHouse() {
    await this.strapi
      .request("get", `/houses/${this.currentHouse.id}/leave`, ErrorMode.Toast)
      .toPromise();
    const houses = this.user.houses.filter(
      (house) => house.id !== this.currentHouse.id
    );
    this.user.houses = houses;
    this.user.current_house = null;
    this.showSelect = false;
    // Fix Ionic issue that doesn't refresh ion-select-options
    setTimeout(() => {
      this.showSelect = true;
    });
    this.refresh = true;
  }

  async createHouse() {
    const nav = document.querySelector("ion-nav");
    await nav.push(HouseCreateComponent, {
      user: this.user,
      callback: this.myCallbackFunction,
    });
  }

  async joinHouse() {
    try {
      const barcodeData = await this.barcodeScanner.scan({
        showTorchButton: true,
        disableAnimations: true,
        formats: "QR_CODE",
      });
      const loading = this.presentLoading();
      const user = await this.strapi
        .request("get", `/houses/${barcodeData.text}/join`, ErrorMode.Toast)
        .toPromise();
      if (user) {
        const id = this.strapi.getUser().id;
        // TODO: Optimize this by only return user infos from api
        const response = await this.apollo
          .query<{ user: User }>({
            query: gql`
              query User($id: ID!) {
                user(id: $id) {
                  id
                  username
                  email
                  provider
                  current_house {
                    id
                    name
                    list_at
                    uuid
                    users {
                      id
                      username
                      email
                    }
                  }
                  houses {
                    id
                    name
                  }
                }
              }
            `,
            variables: {
              id: id,
            },
          })
          .toPromise();
        this.user = response.data.user;
        await this.storage.setItem(StoreConstants.USER, this.user);
        this.isLocal = this.user.provider === "local";
        this.currentHouse = this.user.current_house;
      }
    } catch (error) {
      console.log(error);
    }
    await this.loading.dismiss();
    /*     const nav = document.querySelector("ion-nav");
    await nav.push(HouseJoinComponent, {
      user: this.user,
      callback: this.myCallbackFunction,
    }); */
  }

  async showUserInformations() {
    const nav = document.querySelector("ion-nav");
    await nav.push(UserInformationsComponent, {
      user: this.user,
      callback: this.myCallbackFunction,
    });
  }

  async showUserEditPassword() {
    const nav = document.querySelector("ion-nav");
    await nav.push(UserEditPasswordComponent, {
      user: this.user,
      callback: this.myCallbackFunction,
    });
  }

  async logout() {
    this.closeModal();
    await this.strapi.logout();
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: "Traitement en cours...",
      spinner: "bubbles",
    });
    await this.loading.present();
  }
}
