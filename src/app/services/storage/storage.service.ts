import { Injectable } from "@angular/core";
import { Plugins } from "@capacitor/core";
import { from, of } from "rxjs";
import { switchMap } from "rxjs/operators";

const { Storage } = Plugins;

@Injectable({
  providedIn: "root",
})
export class StorageService {
  constructor() {}

  setItem(storageKey: string, value: any): Promise<void> {
    const encryptedValue = btoa(escape(JSON.stringify(value)));
    return Storage.set({ key: storageKey, value: encryptedValue });
  }

  getItem(storageKey: string): Promise<any> {
    return new Promise((resolve) => {
      Storage.get({ key: storageKey }).then((res) => {
        if (res.value) {
          resolve(JSON.parse(unescape(atob(res.value))));
        } else {
          resolve(null);
        }
      });
    });
  }

  removeItem(storageKey: string): Promise<void> {
    return Storage.remove({ key: storageKey });
  }

  clear(): Promise<void> {
    return Storage.clear();
  }
}
