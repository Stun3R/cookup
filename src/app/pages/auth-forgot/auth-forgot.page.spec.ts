import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AuthForgotPage } from './auth-forgot.page';

describe('AuthForgotPage', () => {
  let component: AuthForgotPage;
  let fixture: ComponentFixture<AuthForgotPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthForgotPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthForgotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
