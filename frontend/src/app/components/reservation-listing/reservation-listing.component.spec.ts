import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationListingComponent } from './reservation-listing.component';

describe('ReservationListingComponent', () => {
  let component: ReservationListingComponent;
  let fixture: ComponentFixture<ReservationListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
