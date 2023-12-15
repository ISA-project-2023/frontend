import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemAdminRegistrationComponent } from './system-admin-registration.component';

describe('SystemAdminRegistrationComponent', () => {
  let component: SystemAdminRegistrationComponent;
  let fixture: ComponentFixture<SystemAdminRegistrationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SystemAdminRegistrationComponent]
    });
    fixture = TestBed.createComponent(SystemAdminRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
