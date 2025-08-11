import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPhase4Component } from './add-phase4.component';

describe('AddPhase4Component', () => {
  let component: AddPhase4Component;
  let fixture: ComponentFixture<AddPhase4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPhase4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPhase4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
