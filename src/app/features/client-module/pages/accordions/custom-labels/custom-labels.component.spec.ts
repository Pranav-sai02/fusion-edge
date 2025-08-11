import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomLabelsComponent } from './custom-labels.component';

describe('CustomLabelsComponent', () => {
  let component: CustomLabelsComponent;
  let fixture: ComponentFixture<CustomLabelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomLabelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
