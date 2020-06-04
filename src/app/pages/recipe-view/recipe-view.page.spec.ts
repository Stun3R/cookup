import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecipeViewPage } from './recipe-view.page';

describe('RecipeViewPage', () => {
  let component: RecipeViewPage;
  let fixture: ComponentFixture<RecipeViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
