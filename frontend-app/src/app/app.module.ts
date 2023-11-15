import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CompaniesModule } from 'src/features/companies/companies.module';
import { HomeModule } from 'src/features/home/home.module';
import { LoginModule } from 'src/features/login/login.module';
import { MyProfileComponent } from 'src/features/users/my-profile/my-profile.component';
import { UsersModule } from 'src/features/users/users.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    CompaniesModule,
    UsersModule,
    HomeModule,
    LoginModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
