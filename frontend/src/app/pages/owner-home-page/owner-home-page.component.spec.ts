import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerHomePageComponent } from './owner-home-page.component';

describe('OwnerHomePageComponent', () => {
  let component: OwnerHomePageComponent;
  let fixture: ComponentFixture<OwnerHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerHomePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
