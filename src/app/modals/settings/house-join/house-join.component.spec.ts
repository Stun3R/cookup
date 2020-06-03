import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HouseJoinComponent } from './house-join.component';

describe('HouseJoinComponent', () => {
  let component: HouseJoinComponent;
  let fixture: ComponentFixture<HouseJoinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HouseJoinComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HouseJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
