import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgSuccessComponent } from './msg-success';

describe('MsgSuccessComponent', () => {
  let component: MsgSuccessComponent;
  let fixture: ComponentFixture<MsgSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsgSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsgSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
