import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DayjsExpirePipe } from "./dates/dayjs-expire.pipe";
import { DayjsRecipePipe } from "./dates/dayjs-recipe.pipe";

@NgModule({
  declarations: [DayjsExpirePipe, DayjsRecipePipe],
  imports: [CommonModule],
  exports: [DayjsExpirePipe, DayjsRecipePipe],
})
export class PipeModule {}
