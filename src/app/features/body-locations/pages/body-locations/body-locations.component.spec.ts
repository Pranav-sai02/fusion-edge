import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyLocationsComponent } from './body-locations.component';

describe('BodyLocationsComponent', () => {
  let component: BodyLocationsComponent;
  let fixture: ComponentFixture<BodyLocationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BodyLocationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BodyLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
