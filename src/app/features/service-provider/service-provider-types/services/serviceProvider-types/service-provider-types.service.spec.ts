import { TestBed } from '@angular/core/testing';

import { ServiceProviderTypesService } from './service-provider-types.service';

describe('ServiceProviderTypesService', () => {
  let service: ServiceProviderTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceProviderTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
