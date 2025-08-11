import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimControllerComponent } from './claim-controller.component';

describe('ClaimControllerComponent', () => {
  let component: ClaimControllerComponent;
  let fixture: ComponentFixture<ClaimControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClaimControllerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
