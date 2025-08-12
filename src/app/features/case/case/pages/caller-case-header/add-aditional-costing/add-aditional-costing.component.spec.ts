import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAditionalCostingComponent } from './add-aditional-costing.component';

describe('AddAditionalCostingComponent', () => {
  let component: AddAditionalCostingComponent;
  let fixture: ComponentFixture<AddAditionalCostingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddAditionalCostingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAditionalCostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
