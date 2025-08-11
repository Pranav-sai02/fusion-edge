import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsPopupComponent } from './claims-popup.component';

describe('ClaimsPopupComponent', () => {
  let component: ClaimsPopupComponent;
  let fixture: ComponentFixture<ClaimsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClaimsPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
