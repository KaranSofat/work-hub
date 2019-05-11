import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBookmarkingComponent } from './list-bookmarking.component';

describe('ListBookmarkingComponent', () => {
  let component: ListBookmarkingComponent;
  let fixture: ComponentFixture<ListBookmarkingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBookmarkingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBookmarkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
