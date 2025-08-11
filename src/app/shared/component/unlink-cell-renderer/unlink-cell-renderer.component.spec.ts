import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlinkCellRendererComponent } from './unlink-cell-renderer.component';

describe('UnlinkCellRendererComponent', () => {
  let component: UnlinkCellRendererComponent;
  let fixture: ComponentFixture<UnlinkCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnlinkCellRendererComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnlinkCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
