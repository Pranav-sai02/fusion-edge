import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalCostingComponent } from './additional-costing.component';

describe('AdditionalCostingComponent', () => {
  let component: AdditionalCostingComponent;
  let fixture: ComponentFixture<AdditionalCostingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdditionalCostingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalCostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
