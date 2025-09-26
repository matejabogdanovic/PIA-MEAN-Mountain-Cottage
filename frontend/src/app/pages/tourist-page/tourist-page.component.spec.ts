import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouristPageComponent } from './tourist-page.component';

describe('TouristPageComponent', () => {
  let component: TouristPageComponent;
  let fixture: ComponentFixture<TouristPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TouristPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TouristPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
