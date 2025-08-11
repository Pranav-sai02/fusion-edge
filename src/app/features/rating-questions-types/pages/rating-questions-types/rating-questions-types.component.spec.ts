import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingQuestionsTypesComponent } from './rating-questions-types.component';

describe('RatingQuestionsTypesComponent', () => {
  let component: RatingQuestionsTypesComponent;
  let fixture: ComponentFixture<RatingQuestionsTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RatingQuestionsTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingQuestionsTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
