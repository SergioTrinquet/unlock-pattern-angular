import { TestBed } from '@angular/core/testing';

import { SelectStateService } from './select-state.service';

describe('SelectStateService', () => {
  let service: SelectStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
