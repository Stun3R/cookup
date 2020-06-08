import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-recipe-view",
  templateUrl: "./recipe-view.page.html",
  styleUrls: ["./recipe-view.page.scss"],
})
export class RecipeViewPage implements OnInit {
  private segment: string = "foods";
  private recipe: any;
  private places = {
    fridge: "Frigo",
    freezer: "Congélateur",
    pantry: "Cellier",
  };

  constructor(private route: ActivatedRoute) {}

  async ngOnInit() {
    if (this.route.snapshot.data["data"]) {
      const { recipe } = this.route.snapshot.data["data"];
      this.recipe = recipe;
    }
  }
}
