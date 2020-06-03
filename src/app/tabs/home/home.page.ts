import { Component, OnInit } from "@angular/core";
import { ModalController, IonRouterOutlet } from "@ionic/angular";
import { StorageService } from "src/app/services/storage/storage.service";
import { StoreConstants, User } from "src/app/interfaces";
import { StrapiService } from "src/app/services/strapi/strapi.service";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { SettingsComponent } from "src/app/modals/settings/settings.component";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  private user: User = {
    id: -1,
    username: "",
    email: "",
    provider: "",
    current_house: null,
    houses: [],
  };
  constructor(
    private strapi: StrapiService,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private storage: StorageService,
    private apollo: Apollo
  ) {}

  async ngOnInit() {
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
  }

  async presentUserPreferences() {
    const modal = await this.modalController.create({
      component: SettingsComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
    });

    return await modal.present();
  }
}
