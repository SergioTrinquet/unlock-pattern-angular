import { TestBed } from '@angular/core/testing';

import { AbortStrokesAnimationService } from './abort-animation.service';

describe('AbortStrokesAnimationService', () => {
  let service: AbortStrokesAnimationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbortStrokesAnimationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
