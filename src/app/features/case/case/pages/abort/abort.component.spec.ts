import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbortComponent } from './abort.component';

describe('AbortComponent', () => {
  let component: AbortComponent;
  let fixture: ComponentFixture<AbortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AbortComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
