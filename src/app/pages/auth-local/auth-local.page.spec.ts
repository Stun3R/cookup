import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AuthLocalPage } from './auth-local.page';

describe('AuthLocalPage', () => {
  let component: AuthLocalPage;
  let fixture: ComponentFixture<AuthLocalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthLocalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthLocalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
