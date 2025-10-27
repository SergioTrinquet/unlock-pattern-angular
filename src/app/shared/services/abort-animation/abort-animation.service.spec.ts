import { TestBed } from '@angular/core/testing';

import { AbortAnimationService } from './abort-animation.service';

describe('AbortAnimationService', () => {
  let service: AbortAnimationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbortAnimationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
