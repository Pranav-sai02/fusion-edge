import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasePopupComponent } from './case-popup.component';

describe('CasePopupComponent', () => {
  let component: CasePopupComponent;
  let fixture: ComponentFixture<CasePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CasePopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
