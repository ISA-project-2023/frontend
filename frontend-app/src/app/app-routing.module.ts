import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from 'src/features/companies/company/company.component';
import { HomeComponent } from 'src/features/home/home/home.component';
import { LoginComponent } from 'src/features/users/login/login.component';
import { RegistrationComponent } from 'src/features/users/registration/registration.component';

const routes: Routes = [
  { path: 'companiesReview', component: CompanyComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
