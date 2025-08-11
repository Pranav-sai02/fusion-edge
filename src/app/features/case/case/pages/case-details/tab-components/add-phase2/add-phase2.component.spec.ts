import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPhase2Component } from './add-phase2.component';

describe('AddPhase2Component', () => {
  let component: AddPhase2Component;
  let fixture: ComponentFixture<AddPhase2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPhase2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPhase2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
