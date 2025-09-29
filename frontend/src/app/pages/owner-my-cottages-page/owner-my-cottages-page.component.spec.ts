import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerMyCottagesPageComponent } from './owner-my-cottages-page.component';

describe('OwnerMyCottagesPageComponent', () => {
  let component: OwnerMyCottagesPageComponent;
  let fixture: ComponentFixture<OwnerMyCottagesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerMyCottagesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerMyCottagesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
