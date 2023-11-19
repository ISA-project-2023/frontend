import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CompanyComponent } from './company/company.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { CompanyProfileFormComponent } from './company-profile-form/company-profile-form.component';
import { PickupAppointmentFormComponent } from './pickup-appointment-form/pickup-appointment-form.component';
import { CompanyRegistrationComponent } from './company-registration/company-registration.component';
import { SearchEquipmentComponent } from './search-equipment/search-equipment.component';



@NgModule({
  declarations: [
    CompanyComponent,
    CompanyProfileComponent,
    CompanyProfileFormComponent,
    PickupAppointmentFormComponent,
    CompanyRegistrationComponent,
    SearchEquipmentComponent
  ],
  imports: [
    CommonModule,
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class CompaniesModule { }
