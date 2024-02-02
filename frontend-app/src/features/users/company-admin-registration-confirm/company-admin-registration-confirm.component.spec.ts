import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAdminRegistrationConfirmComponent } from './company-admin-registration-confirm.component';

describe('CompanyAdminRegistrationConfirmComponent', () => {
  let component: CompanyAdminRegistrationConfirmComponent;
  let fixture: ComponentFixture<CompanyAdminRegistrationConfirmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyAdminRegistrationConfirmComponent]
    });
    fixture = TestBed.createComponent(CompanyAdminRegistrationConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
