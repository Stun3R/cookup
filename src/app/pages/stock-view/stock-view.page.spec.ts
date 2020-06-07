import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StockViewPage } from './stock-view.page';

describe('StockViewPage', () => {
  let component: StockViewPage;
  let fixture: ComponentFixture<StockViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StockViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
