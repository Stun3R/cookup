import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { HousesComponent } from "./houses.component";

describe("SettingsComponent", () => {
  let component: HousesComponent;
  let fixture: ComponentFixture<HousesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HousesComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(HousesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
