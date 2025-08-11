import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CauseOfDeathComponent } from './cause-of-death.component';

describe('CauseOfDeathComponent', () => {
  let component: CauseOfDeathComponent;
  let fixture: ComponentFixture<CauseOfDeathComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CauseOfDeathComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CauseOfDeathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
