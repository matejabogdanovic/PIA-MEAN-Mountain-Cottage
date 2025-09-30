import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CottageSearchComponent } from './cottage-search.component';

describe('CottageSearchComponent', () => {
  let component: CottageSearchComponent;
  let fixture: ComponentFixture<CottageSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CottageSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CottageSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
