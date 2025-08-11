import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTabComponent } from './client-tab.component';

describe('ClientTabComponent', () => {
  let component: ClientTabComponent;
  let fixture: ComponentFixture<ClientTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
