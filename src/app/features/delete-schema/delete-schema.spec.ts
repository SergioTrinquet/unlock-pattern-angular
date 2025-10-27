import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSchemaComponent } from './delete-schema';

describe('DeleteSchema', () => {
  let component: DeleteSchemaComponent;
  let fixture: ComponentFixture<DeleteSchemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteSchemaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteSchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
