import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkDocumentsPopupComponent } from './link-documents-popup.component';

describe('LinkDocumentsPopupComponent', () => {
  let component: LinkDocumentsPopupComponent;
  let fixture: ComponentFixture<LinkDocumentsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LinkDocumentsPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkDocumentsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
