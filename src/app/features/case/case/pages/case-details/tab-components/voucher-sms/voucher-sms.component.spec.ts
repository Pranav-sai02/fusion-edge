import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherSmsComponent } from './voucher-sms.component';

describe('VoucherSmsComponent', () => {
  let component: VoucherSmsComponent;
  let fixture: ComponentFixture<VoucherSmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VoucherSmsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
