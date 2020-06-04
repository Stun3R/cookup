import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-recipe-view",
  templateUrl: "./recipe-view.page.html",
  styleUrls: ["./recipe-view.page.scss"],
})
export class RecipeViewPage implements OnInit {
  private segment: string = "foods";

  constructor() {}

  ngOnInit() {}
}
