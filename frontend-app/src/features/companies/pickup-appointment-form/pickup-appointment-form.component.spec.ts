import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupAppointmentFormComponent } from './pickup-appointment-form.component';

describe('PickupAppointmentFormComponent', () => {
  let component: PickupAppointmentFormComponent;
  let fixture: ComponentFixture<PickupAppointmentFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PickupAppointmentFormComponent]
    });
    fixture = TestBed.createComponent(PickupAppointmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
