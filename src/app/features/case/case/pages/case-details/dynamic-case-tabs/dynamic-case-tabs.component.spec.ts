import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicCaseTabsComponent } from './dynamic-case-tabs.component';

describe('DynamicCaseTabsComponent', () => {
  let component: DynamicCaseTabsComponent;
  let fixture: ComponentFixture<DynamicCaseTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynamicCaseTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicCaseTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
