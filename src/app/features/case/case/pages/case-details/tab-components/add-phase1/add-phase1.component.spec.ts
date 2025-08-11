import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPhase1Component } from './add-phase1.component';

describe('AddPhase1Component', () => {
  let component: AddPhase1Component;
  let fixture: ComponentFixture<AddPhase1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPhase1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPhase1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
