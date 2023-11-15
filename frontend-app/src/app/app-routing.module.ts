import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from 'src/features/companies/company/company.component';
import { HomeComponent } from 'src/features/home/home/home.component';
import { LoginComponent } from 'src/features/login/login/login.component';
import { CompanyProfileComponent } from 'src/features/companies/company-profile/company-profile.component';

const routes: Routes = [
  { path: 'companiesReview', component: CompanyComponent },
  { path: 'company-profile/:id', component: CompanyProfileComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
