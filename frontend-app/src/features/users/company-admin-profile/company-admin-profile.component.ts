import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../model/user.model';
import { CompanyAdmin } from '../model/company-admin.model';
import { PickupAppointmentFormComponent } from 'src/features/companies/pickup-appointment-form/pickup-appointment-form.component';

@Component({
  selector: 'app-company-admin-profile',
  templateUrl: './company-admin-profile.component.html',
  styleUrls: ['./company-admin-profile.component.css']
})
export class CompanyAdminProfileComponent implements OnInit {
  user!: User;
  updatedUser!:User;
  companyAdmin!: CompanyAdmin; 
  updatedCompanyAdmin!: CompanyAdmin; 
  shouldEdit: boolean = false;
  shouldRenderEditForm: boolean = false; 

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.getUser();

    // TODO -> fix - user and companyAdmin undefined here and they shouldn't be
    console.log(this.user);
    console.log(this.companyAdmin);
  }

  getUser(): void{
    this.userService.getCurrentUser().subscribe(
      (user: User) => {
        this.user = user;
        this.updatedUser = user;
        this.getCompanyAdmin(user);
      },
      (error) => {
        console.error('Error fetching current user:', error);
      }
    );
  }

  getCompanyAdmin(user: User): void{
    this.userService.getCompanyAdmin(user.id).subscribe(
      (compAdmin : CompanyAdmin) => {
        this.companyAdmin = compAdmin;
        this.companyAdmin.user = user;
        this.updatedCompanyAdmin = compAdmin;
      },
      (error) => {
        console.error('Error fetching current logged in company administrator:', error);
      }
    );
  }

  editProfile(): void{
    this.shouldRenderEditForm = true;
    this.shouldEdit = true;
  }

  onCompanyAdminUpdated(): void{
    this.shouldEdit = false;
    this. shouldRenderEditForm = false;
    this.getUser();
  }

  addNewAppointment(): void {
    this.router.navigate(['company-admin-profile/add-appointment']);
  }

  seeCompanyDetails(companyId: number): void{
    this.router.navigate(['company-profile/' + companyId]);
  }
}
