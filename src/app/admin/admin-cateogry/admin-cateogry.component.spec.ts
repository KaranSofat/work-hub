import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCateogryComponent } from './admin-cateogry.component';

describe('AdminCateogryComponent', () => {
  let component: AdminCateogryComponent;
  let fixture: ComponentFixture<AdminCateogryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCateogryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCateogryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
