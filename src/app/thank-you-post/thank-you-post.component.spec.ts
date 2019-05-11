import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankYouPostComponent } from './thank-you-post.component';

describe('ThankYouPostComponent', () => {
  let component: ThankYouPostComponent;
  let fixture: ComponentFixture<ThankYouPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThankYouPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThankYouPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
