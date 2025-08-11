import { TestBed } from '@angular/core/testing';

import { ClaimCentreStateService } from './claim-centre-state.service';

describe('ClaimCentreStateService', () => {
  let service: ClaimCentreStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClaimCentreStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
