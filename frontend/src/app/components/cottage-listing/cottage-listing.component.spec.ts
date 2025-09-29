import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CottageListingComponent } from './cottage-listing.component';

describe('CottageListingComponent', () => {
  let component: CottageListingComponent;
  let fixture: ComponentFixture<CottageListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CottageListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CottageListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
