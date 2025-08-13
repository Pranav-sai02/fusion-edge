import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallRatingSs2Component } from './call-rating-ss2.component';

describe('CallRatingSs2Component', () => {
  let component: CallRatingSs2Component;
  let fixture: ComponentFixture<CallRatingSs2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CallRatingSs2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallRatingSs2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
