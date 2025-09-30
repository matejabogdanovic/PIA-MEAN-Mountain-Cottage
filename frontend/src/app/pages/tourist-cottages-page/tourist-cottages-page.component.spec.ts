import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouristCottagesPageComponent } from './tourist-cottages-page.component';

describe('TouristCottagesPageComponent', () => {
  let component: TouristCottagesPageComponent;
  let fixture: ComponentFixture<TouristCottagesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TouristCottagesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TouristCottagesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
