import { TestBed } from '@angular/core/testing';

import { AnimationBackgroundGridService } from './animation-background-grid.service';

describe('AnimationBackgroundGridService', () => {
  let service: AnimationBackgroundGridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimationBackgroundGridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
