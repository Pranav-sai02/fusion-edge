import { TestBed } from '@angular/core/testing';

import { ServiceProvidersStateService } from './service-providers-state.service';

describe('ServiceProvidersStateService', () => {
  let service: ServiceProvidersStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceProvidersStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
