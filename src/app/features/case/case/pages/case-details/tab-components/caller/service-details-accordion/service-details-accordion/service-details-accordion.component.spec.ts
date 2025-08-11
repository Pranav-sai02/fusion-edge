import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDetailsAccordionComponent } from './service-details-accordion.component';

describe('ServiceDetailsAccordionComponent', () => {
  let component: ServiceDetailsAccordionComponent;
  let fixture: ComponentFixture<ServiceDetailsAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceDetailsAccordionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceDetailsAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
