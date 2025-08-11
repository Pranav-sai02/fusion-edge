import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileLinkRendererComponent } from './file-link-renderer.component';

describe('FileLinkRendererComponent', () => {
  let component: FileLinkRendererComponent;
  let fixture: ComponentFixture<FileLinkRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileLinkRendererComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileLinkRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
