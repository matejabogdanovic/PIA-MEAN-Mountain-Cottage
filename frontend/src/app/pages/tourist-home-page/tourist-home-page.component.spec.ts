import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouristHomePageComponent } from './tourist-home-page.component';

describe('TouristHomePageComponent', () => {
  let component: TouristHomePageComponent;
  let fixture: ComponentFixture<TouristHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TouristHomePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TouristHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
