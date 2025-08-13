import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseCostingComponent } from './phase-costing.component';

describe('PhaseCostingComponent', () => {
  let component: PhaseCostingComponent;
  let fixture: ComponentFixture<PhaseCostingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PhaseCostingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhaseCostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
