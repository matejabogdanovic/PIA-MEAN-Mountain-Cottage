import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerStatisticsPageComponent } from './owner-statistics-page.component';

describe('OwnerStatisticsPageComponent', () => {
  let component: OwnerStatisticsPageComponent;
  let fixture: ComponentFixture<OwnerStatisticsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerStatisticsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerStatisticsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
