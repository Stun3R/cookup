import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import * as dayjs from "dayjs";
require("dayjs/locale/fr");
dayjs.locale("fr");

const isBetween = require("dayjs/plugin/isBetween");
const isToday = require("dayjs/plugin/isToday");
const isTomorrow = require("dayjs/plugin/isTomorrow");
const isYesterday = require("dayjs/plugin/isYesterday");

dayjs.extend(isBetween);
dayjs.extend(isToday);
dayjs.extend(isTomorrow);
dayjs.extend(isYesterday);

declare module "dayjs" {
  interface Dayjs {
    isBetween(date1: any, date2: any): boolean;
    isToday(): boolean;
    isTomorrow(): boolean;
    isYesterday(): boolean;
  }
}

@Pipe({
  name: "dayjsExpire",
})
export class DayjsExpirePipe implements PipeTransform {
  constructor(private _sanitizer: DomSanitizer) {}

  transform(date: string, formatIn: string, date2: string) {
    let result: string = "";

    const expire_at = dayjs(date);
    const now = dayjs();
    const nextWeek = now.add(7, "day");

    if (expire_at.isYesterday()) {
      result = `<ion-text color="danger"> Expiré hier </ion-text>`;
      return this._sanitizer.bypassSecurityTrustHtml(result);
    }

    if (expire_at.isToday()) {
      result = `<ion-text color="danger"> Expire aujourd'hui</ion-text>`;
      return this._sanitizer.bypassSecurityTrustHtml(result);
    }

    if (expire_at.isTomorrow()) {
      result = `<ion-text color="warning"> Expire demain </ion-text>`;
      return this._sanitizer.bypassSecurityTrustHtml(result);
    }

    let diff = {
      value: now.diff(expire_at, "day"),
      unit: "jour",
    };

    if (expire_at.isBefore(now)) {
      result = `<ion-text color="danger"> Expiré il y a ${diff.value} ${
        diff.value > 1 ? `${diff.unit}s` : `${diff.unit}`
      } </ion-text>`;
      return this._sanitizer.bypassSecurityTrustHtml(result);
    } else if (expire_at.isBetween(now, nextWeek)) {
      diff.value = diff.value * -1;
      result = `<ion-text color="warning"> Expire dans ${diff.value} ${
        diff.value > 1 ? `${diff.unit}s` : `${diff.unit}`
      } </ion-text>`;
      return this._sanitizer.bypassSecurityTrustHtml(result);
    } else {
      result = `<ion-text color="medium"> Expire le ${expire_at.format(
        "DD/MM/YYYY"
      )} </ion-text>`;
      return this._sanitizer.bypassSecurityTrustHtml(result);
    }
  }
}
