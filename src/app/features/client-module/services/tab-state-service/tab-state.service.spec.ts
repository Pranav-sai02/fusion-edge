import { TestBed } from '@angular/core/testing';

import { TabStateService } from './tab-state.service';

describe('TabStateService', () => {
  let service: TabStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
