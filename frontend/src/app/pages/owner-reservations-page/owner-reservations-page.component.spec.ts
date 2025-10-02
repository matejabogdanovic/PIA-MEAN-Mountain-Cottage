import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerReservationsPageComponent } from './owner-reservations-page.component';

describe('OwnerReservationsPageComponent', () => {
  let component: OwnerReservationsPageComponent;
  let fixture: ComponentFixture<OwnerReservationsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerReservationsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerReservationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
