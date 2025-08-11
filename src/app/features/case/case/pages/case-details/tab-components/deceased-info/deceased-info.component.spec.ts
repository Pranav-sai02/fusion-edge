import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeceasedInfoComponent } from './deceased-info.component';

describe('DeceasedInfoComponent', () => {
  let component: DeceasedInfoComponent;
  let fixture: ComponentFixture<DeceasedInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeceasedInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeceasedInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
