import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingQuestionsOptionsPopupComponent } from './rating-questions-options-popup.component';

describe('RatingQuestionsOptionsPopupComponent', () => {
  let component: RatingQuestionsOptionsPopupComponent;
  let fixture: ComponentFixture<RatingQuestionsOptionsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RatingQuestionsOptionsPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingQuestionsOptionsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
