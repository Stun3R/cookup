import { Pipe, PipeTransform } from "@angular/core";
import * as dayjs from "dayjs";

require("dayjs/locale/fr");
dayjs.locale("fr");

@Pipe({
  name: "dayjsRecipe",
})
export class DayjsRecipePipe implements PipeTransform {
  transform(date: string, formatIn: string, date2: string): string {
    let result: dayjs.Dayjs;
    if (date2) {
      const date2Formatted = dayjs(date2, formatIn);
      result = dayjs(date, formatIn)
        .add(date2Formatted.hour(), "h")
        .add(date2Formatted.minute(), "m")
        .add(date2Formatted.second(), "s");
    } else {
      result = dayjs(date, formatIn);
    }

    const hour = result.hour();
    const min = result.minute();
    const sec = result.second();
    if (hour !== 0) {
      if (min > 0) {
        return result.format("HH") + "h" + result.format("mm");
      }
      return result.format("H") + "h";
    }
    if (min !== 0) {
      if (sec !== 0) {
        return result.format("mm") + "min" + result.format("ss");
      }
      return result.format("mm") + "min";
    }
    return result.format("ss") + "s";
  }
}
