import { TestBed } from '@angular/core/testing';

import { GlobalStore } from './global-store';

describe('GlobalStore', () => {
  let service: GlobalStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
