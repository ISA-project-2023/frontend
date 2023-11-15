import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserComponent } from './user/user.component';
import { MyProfileComponent } from './my-profile/my-profile.component';

@NgModule({
  declarations: [
    UserComponent,
    MyProfileComponent,
  ],
  imports: [
    FormsModule,
    CommonModule, 
  ]
})
export class UsersModule { }
