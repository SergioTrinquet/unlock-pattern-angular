import { TestBed } from '@angular/core/testing';

import { CookieService } from './cookie.service';

describe('Cookie', () => {
  let service: Cookie;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Cookie);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
