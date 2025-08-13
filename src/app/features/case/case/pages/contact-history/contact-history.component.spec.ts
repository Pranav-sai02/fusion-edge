import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactHistoryComponent } from './contact-history.component';

describe('ContactHistoryComponent', () => {
  let component: ContactHistoryComponent;
  let fixture: ComponentFixture<ContactHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
