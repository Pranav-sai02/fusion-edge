import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaCodesComponent } from './area-codes.component';

describe('AreaCodesComponent', () => {
  let component: AreaCodesComponent;
  let fixture: ComponentFixture<AreaCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AreaCodesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
