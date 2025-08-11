import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFilterToolbarComponent } from './user-filter-toolbar.component';

describe('UserFilterToolbarComponent', () => {
  let component: UserFilterToolbarComponent;
  let fixture: ComponentFixture<UserFilterToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserFilterToolbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFilterToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
