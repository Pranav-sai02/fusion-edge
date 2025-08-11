import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveButtonRendererComponent } from './save-button-renderer.component';

describe('SaveButtonRendererComponent', () => {
  let component: SaveButtonRendererComponent;
  let fixture: ComponentFixture<SaveButtonRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaveButtonRendererComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveButtonRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
