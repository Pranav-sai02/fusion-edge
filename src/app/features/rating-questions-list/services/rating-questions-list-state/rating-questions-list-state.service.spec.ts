import { TestBed } from '@angular/core/testing';

import { RatingQuestionsListStateService } from './rating-questions-list-state.service';

describe('RatingQuestionsListStateService', () => {
  let service: RatingQuestionsListStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RatingQuestionsListStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
