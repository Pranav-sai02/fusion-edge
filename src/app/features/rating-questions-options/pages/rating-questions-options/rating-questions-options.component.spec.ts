import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingQuestionsOptionsComponent } from './rating-questions-options.component';

describe('RatingQuestionsOptionsComponent', () => {
  let component: RatingQuestionsOptionsComponent;
  let fixture: ComponentFixture<RatingQuestionsOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RatingQuestionsOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingQuestionsOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
