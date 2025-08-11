import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimCentrePopupComponent } from './claim-centre-popup.component';

describe('ClaimCentrePopupComponent', () => {
  let component: ClaimCentrePopupComponent;
  let fixture: ComponentFixture<ClaimCentrePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClaimCentrePopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimCentrePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
