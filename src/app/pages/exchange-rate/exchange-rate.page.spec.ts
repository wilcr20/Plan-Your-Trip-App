import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExchangeRatePage } from './exchange-rate.page';

describe('ExchangeRatePage', () => {
  let component: ExchangeRatePage;
  let fixture: ComponentFixture<ExchangeRatePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExchangeRatePage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExchangeRatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
