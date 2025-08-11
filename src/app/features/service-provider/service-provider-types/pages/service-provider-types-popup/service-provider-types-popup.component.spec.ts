import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceProviderTypesPopupComponent } from './service-provider-types-popup.component';

describe('ServiceProviderTypesPopupComponent', () => {
  let component: ServiceProviderTypesPopupComponent;
  let fixture: ComponentFixture<ServiceProviderTypesPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceProviderTypesPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceProviderTypesPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
