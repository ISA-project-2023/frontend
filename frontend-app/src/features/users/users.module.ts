import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserComponent } from './user/user.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';


@NgModule({
  declarations: [
    UserComponent,
    MyProfileComponent,
    LoginComponent,
    RegistrationComponent
  ],
  imports: [
    FormsModule,
    CommonModule, 
    ReactiveFormsModule
  ]
})
export class UsersModule { }
