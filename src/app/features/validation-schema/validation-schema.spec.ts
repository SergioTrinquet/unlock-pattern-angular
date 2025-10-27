import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationSchema } from './validation-schema';

describe('ValidationSchema', () => {
  let component: ValidationSchema;
  let fixture: ComponentFixture<ValidationSchema>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationSchema]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidationSchema);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
