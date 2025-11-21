import { TestBed } from '@angular/core/testing';

import { SequenceSchemaValidService } from './sequence-schema-valid.service';

describe('SequenceSchemaValidService', () => {
  let service: SequenceSchemaValidService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SequenceSchemaValidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
