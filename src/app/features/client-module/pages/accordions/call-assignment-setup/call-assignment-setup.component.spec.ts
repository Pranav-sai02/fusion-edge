import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallAssignmentSetupComponent } from './call-assignment-setup.component';

describe('CallAssignmentSetupComponent', () => {
  let component: CallAssignmentSetupComponent;
  let fixture: ComponentFixture<CallAssignmentSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CallAssignmentSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallAssignmentSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
