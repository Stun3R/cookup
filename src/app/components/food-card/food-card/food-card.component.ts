import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "food-card",
  templateUrl: "./food-card.component.html",
  styleUrls: ["./food-card.component.scss"],
})
export class FoodCardComponent implements OnInit {
  @Input() food;
  @Input() root;

  private places = {
    fridge: "Frigo",
    freezer: "Congélateur",
    pantry: "Cellier",
  };
  constructor() {}

  ngOnInit() {}
}
