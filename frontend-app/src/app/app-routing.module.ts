import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from 'src/features/companies/company/company.component';
import { HomeComponent } from 'src/features/home/home/home.component';
import { ChangePasswordComponent } from 'src/features/users/change-password/change-password.component'
import { MyProfileComponent } from 'src/features/users/my-profile/my-profile.component';
import { CompanyProfileComponent } from 'src/features/companies/company-profile/company-profile.component';
import { CompanyProfileFormComponent } from 'src/features/companies/company-profile-form/company-profile-form.component';
import { CompanyAdminProfileComponent } from 'src/features/users/company-admin-profile/company-admin-profile.component';
import { PickupAppointmentFormComponent } from 'src/features/companies/pickup-appointment-form/pickup-appointment-form.component';
import { RegistrationComponent } from 'src/features/users/registration/registration.component';
import { ConfirmRegistrationComponent } from 'src/features/users/confirm-registration/confirm-registration.component';
import { CompanyRegistrationComponent } from 'src/features/companies/company-registration/company-registration.component';
import { SearchEquipmentComponent } from 'src/features/companies/search-equipment/search-equipment.component';
import { MyReservationsComponent } from 'src/features/users/my-reservations/my-reservations.component';
import { SystemAdminProfileComponent } from 'src/features/users/system-admin-profile/system-admin-profile.component';
import { SystemAdminRegistrationComponent } from 'src/features/users/system-admin-registration/system-admin-registration.component';
import { AcceptReservationsComponent } from 'src/features/companies/accept-reservations/accept-reservations.component';
import { PenaltyPointsComponent } from 'src/features/users/penalty-points/penalty-points.component';
import { PickupHistoryComponent } from 'src/features/users/pickup-history/pickup-history.component';
import { QrCodesComponent } from 'src/features/users/qr-codes/qr-codes.component';
import { ContractsComponent } from 'src/features/companies/contracts/contracts.component';

const routes: Routes = [
  { path: 'companiesReview', component: CompanyComponent },
  { path: 'my-profile', component: MyProfileComponent },
  { path: 'company-admin-profile', component: CompanyAdminProfileComponent },
  { path: 'company-profile/:id', component: CompanyProfileComponent },
  { path: 'company-profile/edit/:id', component: CompanyProfileFormComponent },
  { path: 'company-admin-profile/add-appointment', component: PickupAppointmentFormComponent },
  { path: 'home', component: HomeComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'activate/:token', component: ConfirmRegistrationComponent },
  { path: 'companyRegistration', component: CompanyRegistrationComponent},
  { path: 'searchEquipment', component: SearchEquipmentComponent},
  { path: 'my-reservations', component: MyReservationsComponent},
  { path: 'system-admin-profile', component: SystemAdminProfileComponent},
  { path: 'system-admin-registration', component: SystemAdminRegistrationComponent},
  { path: 'accept-reservations', component: AcceptReservationsComponent},
  { path: 'penalty-points', component: PenaltyPointsComponent},
  { path: 'pickupHistory', component: PickupHistoryComponent},
  { path: 'qrCodes', component: QrCodesComponent},
  { path: 'contracts', component: ContractsComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
