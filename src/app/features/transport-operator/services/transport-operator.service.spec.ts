import { TestBed } from '@angular/core/testing';

import { TransportOperatorService } from './transport-operator.service';

describe('TransportOperatorService', () => {
  let service: TransportOperatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransportOperatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
