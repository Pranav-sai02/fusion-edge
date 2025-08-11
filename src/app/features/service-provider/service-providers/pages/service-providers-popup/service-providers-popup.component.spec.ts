import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceProvidersPopupComponent } from './service-providers-popup.component';

describe('ServiceProvidersPopupComponent', () => {
  let component: ServiceProvidersPopupComponent;
  let fixture: ComponentFixture<ServiceProvidersPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceProvidersPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceProvidersPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
