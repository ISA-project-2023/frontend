import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FullCalendarModule } from '@fullcalendar/angular';

import { UserComponent } from './user/user.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './registration/registration.component';
import { ConfirmRegistrationComponent } from './confirm-registration/confirm-registration.component';
import { CompanyAdminProfileComponent } from './company-admin-profile/company-admin-profile.component';
import { CompanyAdminProfileFormComponent } from './company-admin-profile-form/company-admin-profile-form.component';
import { MyReservationsComponent } from './my-reservations/my-reservations.component';
import { SystemAdminProfileComponent } from './system-admin-profile/system-admin-profile.component';
import { SystemAdminRegistrationComponent } from './system-admin-registration/system-admin-registration.component';
import { ChangePasswordComponent } from './change-password/change-password.component';



@NgModule({
  declarations: [
    UserComponent,
    MyProfileComponent,
    RegistrationComponent,
    ConfirmRegistrationComponent, 
    CompanyAdminProfileComponent,
    CompanyAdminProfileFormComponent,
    MyReservationsComponent,
    SystemAdminProfileComponent,
    SystemAdminRegistrationComponent,
    ChangePasswordComponent
  ],
  imports: [
    FormsModule,
    CommonModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FullCalendarModule
  ]
})
export class UsersModule { }
