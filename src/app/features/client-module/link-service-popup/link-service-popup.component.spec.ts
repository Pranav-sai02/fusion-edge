import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkServicePopupComponent } from './link-service-popup.component';

describe('LinkServicePopupComponent', () => {
  let component: LinkServicePopupComponent;
  let fixture: ComponentFixture<LinkServicePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LinkServicePopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkServicePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
