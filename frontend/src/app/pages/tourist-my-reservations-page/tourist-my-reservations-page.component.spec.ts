import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouristMyReservationsPageComponent } from './tourist-my-reservations-page.component';

describe('TouristMyReservationsPageComponent', () => {
  let component: TouristMyReservationsPageComponent;
  let fixture: ComponentFixture<TouristMyReservationsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TouristMyReservationsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TouristMyReservationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
