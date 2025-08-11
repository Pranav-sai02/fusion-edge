import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewButtonRendererComponent } from './view-button-renderer.component';

describe('ViewButtonRendererComponent', () => {
  let component: ViewButtonRendererComponent;
  let fixture: ComponentFixture<ViewButtonRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewButtonRendererComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewButtonRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
