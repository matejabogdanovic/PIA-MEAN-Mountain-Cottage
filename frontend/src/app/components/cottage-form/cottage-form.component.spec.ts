import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CottageFormComponent } from './cottage-form.component';

describe('CottageFormComponent', () => {
  let component: CottageFormComponent;
  let fixture: ComponentFixture<CottageFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CottageFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CottageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
