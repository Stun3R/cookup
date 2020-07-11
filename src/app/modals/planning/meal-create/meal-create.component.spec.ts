import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { MealCreateComponent } from "./meal-create.component";

describe("DailyMenuCreateComponent", () => {
  let component: MealCreateComponent;
  let fixture: ComponentFixture<MealCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MealCreateComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(MealCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
