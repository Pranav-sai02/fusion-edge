import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreacodePopupComponent } from './areacode-popup.component';

describe('AreacodePopupComponent', () => {
  let component: AreacodePopupComponent;
  let fixture: ComponentFixture<AreacodePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AreacodePopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreacodePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
