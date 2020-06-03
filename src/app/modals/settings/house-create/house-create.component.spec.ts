import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { HouseCreateComponent } from "./house-create.component";

describe("HouseCreateComponent", () => {
  let component: HouseCreateComponent;
  let fixture: ComponentFixture<HouseCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HouseCreateComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(HouseCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
