import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AuthResetPage } from './auth-reset.page';

describe('AuthResetPage', () => {
  let component: AuthResetPage;
  let fixture: ComponentFixture<AuthResetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthResetPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthResetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
