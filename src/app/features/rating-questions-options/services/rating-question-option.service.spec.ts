import { TestBed } from '@angular/core/testing';

import { RatingQuestionOptionService } from './rating-question-option.service';

describe('RatingQuestionOptionService', () => {
  let service: RatingQuestionOptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RatingQuestionOptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
