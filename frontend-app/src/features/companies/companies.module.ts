import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyComponent } from './company/company.component';
import { FormsModule } from '@angular/forms';
import { CompanyProfileComponent } from './company-profile/company-profile.component';



@NgModule({
  declarations: [
    CompanyComponent,
    CompanyProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class CompaniesModule { }
