import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookStepsComponent } from './book-steps.component';

describe('BookStepsComponent', () => {
  let component: BookStepsComponent;
  let fixture: ComponentFixture<BookStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookStepsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
