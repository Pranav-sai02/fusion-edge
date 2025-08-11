import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingQuestionsListPopupComponent } from './rating-questions-list-popup.component';

describe('RatingQuestionsListPopupComponent', () => {
  let component: RatingQuestionsListPopupComponent;
  let fixture: ComponentFixture<RatingQuestionsListPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RatingQuestionsListPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingQuestionsListPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
