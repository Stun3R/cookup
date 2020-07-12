import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { StrapiService } from "src/app/services/strapi/strapi.service";

@Component({
  selector: "app-aliment-view",
  templateUrl: "./aliment-view.page.html",
  styleUrls: ["./aliment-view.page.scss"],
})
export class AlimentViewPage implements OnInit {
  private aliment: any;
  private updateFoodForm: FormGroup;
  private isEditable: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private strapi: StrapiService
  ) {}

  async ngOnInit() {
    if (this.route.snapshot.data["data"]) {
      const { aliment } = this.route.snapshot.data["data"];
      this.aliment = aliment;
    }
    this.updateFoodForm = this.formBuilder.group({
      quantity: [this.aliment?.quantity, [Validators.required]],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.updateFoodForm.controls;
  }

  async handleButton() {
    if (!this.isEditable) {
      this.isEditable = true;
      return;
    }
    if (this.updateFoodForm.invalid) {
      return;
    }
    const aliment = await this.strapi
      .updateEntry("aliments", this.aliment.id.toString(), {
        ...this.updateFoodForm.value,
      })
      .toPromise();
    this.isEditable = false;
  }
}
