import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Company } from '../model/company.model';
import { Equipment } from '../model/equipment.model';
import { CompanyService } from '../company.service';
import { CompanyAdmin } from 'src/features/users/model/company-admin.model';
import { User } from 'src/features/users/model/user.model';
import { UserService } from 'src/features/users/user.service';
import { PickUpAppointment } from '../model/pickup-appointment.model';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css'],
  providers: [DatePipe]
})
export class CompanyProfileComponent implements OnInit {
  companyId: number = 0;
  company: Company | undefined;
  equipment: Equipment[] = [];
  admins: CompanyAdmin[] = [];
  appointments: PickUpAppointment[] = [];
  users: User[] = [];
  canShow: boolean = false; // TODO - only admin van change
  shouldEdit: boolean = false;
  shouldRenderEditForm: boolean = false; 
  
  constructor(private companyService: CompanyService, private userService: UserService, private activatedRoute : ActivatedRoute) {
    this.activatedRoute.params.subscribe(params=>{
      this.companyId=params['id'];
    });

    if (this.companyId !== undefined){
      this.canShow = true;
    }
    this.getCompany();
  } 
  
  ngOnInit() {
    this.getCompany();
  }

  getCompany(): void {
    this.companyService.getCompany(this.companyId).subscribe(
      (data) => {
        this.company = data;
        this.equipment = this.company.equipment;
        this.getCompanyAdmins(this.company);
        this.getAppointments();
      },
      (error) => {
        console.error('Unable to load company. Try again later.');
      }
    );
  }

  getCompanyAdmins(company: Company): void{
    this.userService.getCompanyAdminsByCompany(company).subscribe(
      (data) => {
        this.admins = data;
        this.getUsers(this.admins);
      },
      (error) => {
        console.error('Unable to load company administrators. Try again later.');
      }
    );
  }

  getUsers(admins: CompanyAdmin[]): void {
    admins.forEach(admin => {
      let user : User;
      this.userService.getUser(admin.id).subscribe(
        (data) => {
          user = data;
          admin.user = user;
          //console.log(admin.user);
        },
        (error) => {
          console.error('Unable to load user. Try again later.');
        }
      );
    })
  }

  getAppointments(): void {
    if (this.company !== undefined){
      this.companyService.getByCompany(this.company).subscribe(
        (data) => {
          this.appointments = data;
        },
        (error) => {
          console.error('Unable to load appointments.');
        }
      );
    } else {
      console.error('Unable to load appointments. Company isnt loaded.');
    }    
  }

  editCompany(): void{
    this.shouldRenderEditForm = true;
    this.shouldEdit = true;
  }

  onCompanyUpdated(): void {
    this.getCompany();
    this.shouldEdit = false;
    this. shouldRenderEditForm = false;
  }
  
  // deleteCompanyProfile(): void {
  //   this.companyService.deleteCompany(this.companyId).subscribe();
  // }
}