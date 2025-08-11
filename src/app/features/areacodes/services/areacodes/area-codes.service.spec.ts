import { TestBed } from '@angular/core/testing';

import { AreaCodesService } from './area-codes.service';

describe('AreaCodesService', () => {
  let service: AreaCodesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AreaCodesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
