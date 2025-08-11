import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallerCaseHeaderComponent } from './caller-case-header.component';

describe('CallerCaseHeaderComponent', () => {
  let component: CallerCaseHeaderComponent;
  let fixture: ComponentFixture<CallerCaseHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CallerCaseHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallerCaseHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
