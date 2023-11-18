import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { UserComponent } from './user/user.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { CompanyAdminProfileComponent } from './company-admin-profile/company-admin-profile.component';
import { CompanyAdminProfileFormComponent } from './company-admin-profile-form/company-admin-profile-form.component';


@NgModule({
  declarations: [
    UserComponent,
    MyProfileComponent,
    LoginComponent,
    RegistrationComponent,
    CompanyAdminProfileComponent,
    CompanyAdminProfileFormComponent
  ],
  imports: [
    FormsModule,
    CommonModule, 
    MatFormFieldModule, 
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class UsersModule { }
