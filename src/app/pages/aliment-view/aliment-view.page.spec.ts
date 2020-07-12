import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AlimentViewPage } from './aliment-view.page';

describe('AlimentViewPage', () => {
  let component: AlimentViewPage;
  let fixture: ComponentFixture<AlimentViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlimentViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AlimentViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
