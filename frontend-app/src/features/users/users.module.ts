import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserComponent } from './user/user.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { CompanyAdminProfileComponent } from './company-admin-profile/company-admin-profile.component';


@NgModule({
  declarations: [
    UserComponent,
    MyProfileComponent,
    LoginComponent,
    RegistrationComponent,
    CompanyAdminProfileComponent
  ],
  imports: [
    FormsModule,
    CommonModule, 
    ReactiveFormsModule
  ]
})
export class UsersModule { }
