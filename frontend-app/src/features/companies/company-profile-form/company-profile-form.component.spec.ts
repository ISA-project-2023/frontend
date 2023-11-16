import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyProfileFormComponent } from './company-profile-form.component';

describe('CompanyProfileFormComponent', () => {
  let component: CompanyProfileFormComponent;
  let fixture: ComponentFixture<CompanyProfileFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyProfileFormComponent]
    });
    fixture = TestBed.createComponent(CompanyProfileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
