import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesPagePopupComponent } from './services-page-popup.component';

describe('ServicesPagePopupComponent', () => {
  let component: ServicesPagePopupComponent;
  let fixture: ComponentFixture<ServicesPagePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServicesPagePopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesPagePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
