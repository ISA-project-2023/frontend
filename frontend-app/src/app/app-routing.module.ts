import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from 'src/features/companies/company/company.component';
import { HomeComponent } from 'src/features/home/home/home.component';
import { MyProfileComponent } from 'src/features/users/my-profile/my-profile.component';
import { CompanyProfileComponent } from 'src/features/companies/company-profile/company-profile.component';
import { CompanyProfileFormComponent } from 'src/features/companies/company-profile-form/company-profile-form.component';
import { LoginComponent } from 'src/features/users/login/login.component';
import { RegistrationComponent } from 'src/features/users/registration/registration.component';

const routes: Routes = [
  { path: 'companiesReview', component: CompanyComponent },
  { path: 'my-profile', component: MyProfileComponent },
  { path: 'company-profile/:id', component: CompanyProfileComponent },
  { path: 'company-profile/edit/:id', component: CompanyProfileFormComponent },
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
