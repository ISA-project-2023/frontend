import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAdminProfileFormComponent } from './company-admin-profile-form.component';

describe('CompanyAdminProfileFormComponent', () => {
  let component: CompanyAdminProfileFormComponent;
  let fixture: ComponentFixture<CompanyAdminProfileFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyAdminProfileFormComponent]
    });
    fixture = TestBed.createComponent(CompanyAdminProfileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
