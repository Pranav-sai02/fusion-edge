import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftDeleteButtonRendererComponent } from './soft-delete-button-renderer.component';

describe('SoftDeleteButtonRendererComponent', () => {
  let component: SoftDeleteButtonRendererComponent;
  let fixture: ComponentFixture<SoftDeleteButtonRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoftDeleteButtonRendererComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoftDeleteButtonRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
