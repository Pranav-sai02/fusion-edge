import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceProvidersTypesComponent } from './service-providers-types.component';

describe('ServiceProvidersTypesComponent', () => {
  let component: ServiceProvidersTypesComponent;
  let fixture: ComponentFixture<ServiceProvidersTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceProvidersTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceProvidersTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
