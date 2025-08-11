import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingQuestionsListComponent } from './rating-questions-list.component';

describe('RatingQuestionsListComponent', () => {
  let component: RatingQuestionsListComponent;
  let fixture: ComponentFixture<RatingQuestionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RatingQuestionsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingQuestionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
