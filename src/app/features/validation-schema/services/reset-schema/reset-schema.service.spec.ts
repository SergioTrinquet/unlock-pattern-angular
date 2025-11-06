import { TestBed } from '@angular/core/testing';

import { ResetSchemaService } from './reset-schema.service';

describe('ResetSchemaService', () => {
  let service: ResetSchemaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResetSchemaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
