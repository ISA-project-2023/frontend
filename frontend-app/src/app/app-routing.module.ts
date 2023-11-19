import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from 'src/features/companies/company/company.component';
import { HomeComponent } from 'src/features/home/home/home.component';
import { MyProfileComponent } from 'src/features/users/my-profile/my-profile.component';
import { CompanyProfileComponent } from 'src/features/companies/company-profile/company-profile.component';
import { CompanyProfileFormComponent } from 'src/features/companies/company-profile-form/company-profile-form.component';
import { CompanyAdminProfileComponent } from 'src/features/users/company-admin-profile/company-admin-profile.component';
import { PickupAppointmentFormComponent } from 'src/features/companies/pickup-appointment-form/pickup-appointment-form.component';
import { LoginComponent } from 'src/features/users/login/login.component';
import { RegistrationComponent } from 'src/features/users/registration/registration.component';
import { ConfirmRegistrationComponent } from 'src/features/users/confirm-registration/confirm-registration.component';
import { CompanyRegistrationComponent } from 'src/features/companies/company-registration/company-registration.component';
import { SearchEquipmentComponent } from 'src/features/companies/search-equipment/search-equipment.component';

const routes: Routes = [
  { path: 'companiesReview', component: CompanyComponent },
  { path: 'my-profile', component: MyProfileComponent },
  { path: 'company-admin-profile', component: CompanyAdminProfileComponent },
  { path: 'company-profile/:id', component: CompanyProfileComponent },
  { path: 'company-profile/edit/:id', component: CompanyProfileFormComponent },
  { path: 'company-admin-profile/add-appointment', component: PickupAppointmentFormComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'activate/:token', component: ConfirmRegistrationComponent },
  { path: 'companyRegistration', component: CompanyRegistrationComponent},
  { path: 'searchEquipment', component: SearchEquipmentComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
