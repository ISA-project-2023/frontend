import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button'
import { CompanyComplaint } from '../model/company-complaint.model';
import { CompanyAdminComplaint } from '../model/company-admin-complaint';
import { UserService } from '../user.service';

@Component({
  selector: 'app-system-admin-profile',
  templateUrl: './system-admin-profile.component.html',
  styleUrls: ['./system-admin-profile.component.css']
})

export class SystemAdminProfileComponent implements OnInit {

  companyComplaints: CompanyComplaint[] = []
  companyAdminComplaints: CompanyAdminComplaint[] = []

  selectedComplaint: CompanyComplaint | CompanyAdminComplaint | null = null

  constructor(private router: Router, private userService: UserService){}

  ngOnInit(): void {
    this.userService.getAllCompanyComplaints().subscribe(
      (data) => {
        this.companyComplaints = data
      },
      (error) => {
        console.log(error)
      }
    )

    this.userService.getAllCompanyAdminComplaints().subscribe(
      (data) => {
        this.companyAdminComplaints = data
      },
      (error) => {
        console.log(error)
      }
    )
  }

  addCompanyComponent() : void{
    this.router.navigate(['companyRegistration']);
  }

  addSystemAdmin(){
    this.router.navigate(['system-admin-registration']);
  }

  selectComplaint(complaint: CompanyComplaint | CompanyAdminComplaint){
    this.selectedComplaint = complaint
  }

  sendResponse() : void {

  }
}
