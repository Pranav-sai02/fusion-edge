import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveToggleRendererComponent } from './active-toggle-renderer.component';

describe('ActiveToggleRendererComponent', () => {
  let component: ActiveToggleRendererComponent;
  let fixture: ComponentFixture<ActiveToggleRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActiveToggleRendererComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveToggleRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
