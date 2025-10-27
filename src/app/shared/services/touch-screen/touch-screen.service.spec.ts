import { TestBed } from '@angular/core/testing';

import { TouchScreenService } from './touch-screen.service';

describe('TouchScreenService', () => {
  let service: TouchScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TouchScreenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
