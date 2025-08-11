import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimCentreComponent } from './claim-centre.component';

describe('ClaimCentreComponent', () => {
  let component: ClaimCentreComponent;
  let fixture: ComponentFixture<ClaimCentreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClaimCentreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimCentreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
