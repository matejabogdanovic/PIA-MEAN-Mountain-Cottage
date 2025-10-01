import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CottagePageComponent } from './cottage-page.component';

describe('CottagePageComponent', () => {
  let component: CottagePageComponent;
  let fixture: ComponentFixture<CottagePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CottagePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CottagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
