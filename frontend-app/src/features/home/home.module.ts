import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppModule } from 'src/app/app.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { LoginComponent } from './login/login.component';
import { LandingPageComponent } from './landing-page/landing-page.component';



@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    LandingPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  exports:[HomeComponent]
})
export class HomeModule { }
