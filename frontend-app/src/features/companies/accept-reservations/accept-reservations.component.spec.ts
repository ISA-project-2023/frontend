import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptReservationsComponent } from './accept-reservations.component';

describe('AcceptReservationsComponent', () => {
  let component: AcceptReservationsComponent;
  let fixture: ComponentFixture<AcceptReservationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AcceptReservationsComponent]
    });
    fixture = TestBed.createComponent(AcceptReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
