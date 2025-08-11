import { TestBed } from '@angular/core/testing';

import { ClaimCentreService } from './claim-centre.service';

describe('ClaimCentreService', () => {
  let service: ClaimCentreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClaimCentreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
