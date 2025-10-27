import { TestBed } from '@angular/core/testing';
import { SchemaValidityService } from './schema-validity.service';

describe('SchemaValidityService', () => {
  let service: SchemaValidityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchemaValidityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
