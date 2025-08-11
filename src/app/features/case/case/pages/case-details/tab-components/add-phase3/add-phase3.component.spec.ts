import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPhase3Component } from './add-phase3.component';

describe('AddPhase3Component', () => {
  let component: AddPhase3Component;
  let fixture: ComponentFixture<AddPhase3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPhase3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPhase3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
