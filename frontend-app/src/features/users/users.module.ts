import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { MyProfileComponent } from './my-profile/my-profile.component';



@NgModule({
  declarations: [
    UserComponent,
    MyProfileComponent
  ],
  imports: [
    CommonModule
  ]
})
export class UsersModule { }
