import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportOperatorComponent } from './transport-operator.component';

describe('TransportOperatorComponent', () => {
  let component: TransportOperatorComponent;
  let fixture: ComponentFixture<TransportOperatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransportOperatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
