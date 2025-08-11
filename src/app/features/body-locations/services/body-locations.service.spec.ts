import { TestBed } from '@angular/core/testing';

import { BodyLocationsService } from './body-locations.service';

describe('BodyLocationsService', () => {
  let service: BodyLocationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BodyLocationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
