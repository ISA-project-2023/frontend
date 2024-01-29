import { Component, OnInit } from '@angular/core';
import { User } from 'src/features/users/model/user.model';
import { CompanyService } from '../company.service';
import { Company } from '../model/company.model';
import { UserService } from 'src/features/users/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanyAdmin } from 'src/features/users/model/company-admin.model';


@Component({
  selector: 'app-company-registration',
  templateUrl: './company-registration.component.html',
  styleUrls: ['./company-registration.component.css']
})
export class CompanyRegistrationComponent implements OnInit{

  constructor(private service: CompanyService, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getCompanyAdmins().subscribe({
      next: (response: any) => {
        this.allCompanyAdmins = response;
        console.log(this.allCompanyAdmins)
      },
      error: () => {
        console.log('Company admins failed to load!')
      }
    });
  }

  allEntered: boolean = false
  repassOk: boolean = false
  registrationOk: boolean = false
  userExists: boolean = false
  timeOk: boolean = false
  isCompanyAdminSelected: boolean = false

  name: string = '';
  location: string = '';
  startTime: string = '00:00';
  endTime: string = '00:00';

  nameAdmin: string = '';
  surnameAdmin: string = '';
  username: string = '';
  password: string = '';
  repassword: string = '';
  email: string = '';

  allCompanyAdmins!: CompanyAdmin[]; 
  companyAdmin!: CompanyAdmin;
  selectedCompanyAdmin!: CompanyAdmin | undefined;
  company!: Company;

  save() : void {
    if(this.name === '' || this.location === '' || this.startTime === '' || this.endTime === '' || 
    this.nameAdmin === '' || this.surnameAdmin === '' || this.username === '' || this.password === '' || this.email === ''){
      this.allEntered = true
      this.registrationOk = false
      this.userExists = false
      this.repassOk = false
      this.timeOk = false
    } else if(this.password !== this.repassword){
      this.repassOk = true
      this.allEntered = false
      this.registrationOk = false
      this.userExists = false
      this.timeOk = false
    } else {

      this.company = {
        id: 1,
        name: this.name,
        location: this.location,
        grade: 0,
        startTime: (this.startTime + ':00'),
        endTime: (this.endTime + ':00'),
        equipment: [],
        equipmentAmountInStock: []
      };
      
      this.companyAdmin = {
        id: 1,
        username: this.username,
        email: this.email,
        penaltyPoints: 0,
        role: 'COMPANY_ADMIN', 
        firstName: this.nameAdmin,
        lastName: this.surnameAdmin,
        category: 'REGULAR',
        jobDescription: '',
        company: this.company,
        isVerified: false
      };

    console.log(this.company)
    console.log(this.companyAdmin)
    this.service.addCompany(this.company).subscribe({
      next: () => {
      },
      error: () => {
      }
    });

    this.userService.saveCompanyAdmin(this.companyAdmin, this.password).subscribe({
      next: () => {
        this.registrationOk = true
        this.allEntered = false
        this.repassOk = false
        this.timeOk = false
        this.reset()
      },
      error: () => {
        this.registrationOk = false
        this.userExists = true
        return
      }
    });

    }
  }

  addAdmin() : void {
    this.registrationOk = false
    if(this.selectedCompanyAdmin === undefined){
      console.log("Admin nije selektovan")
      this.isCompanyAdminSelected = true
    } else {
      this.isCompanyAdminSelected = false
      if(this.name !== '' && this.location !== '' && this.startTime !== '' && this.endTime !== ''){
        this.allEntered = false
        this.company = {
          id: 1,
          name: this.name,
          location: this.location,
          grade: 0,
          startTime: (this.startTime + ':00'),
          endTime: (this.endTime + ':00'),
          equipment: [],
          equipmentAmountInStock: []
        };
        console.log("Dodavanje postojeceg admina")
    
        this.service.addCompany(this.company).subscribe({
          next: () => {
          },
          error: () => {
          }
        });
        console.log(this.selectedCompanyAdmin.firstName)
        this.userService.addAdminToCompany(this.selectedCompanyAdmin).subscribe({
          next: () => {
            this.registrationOk = true
            this.allEntered = false
            this.repassOk = false
            this.timeOk = false
            this.selectedCompanyAdmin = undefined
            this.reset()
          },
          error: (error) => {
            console.log(error)
            this.registrationOk = false
            this.userExists = true
            return
          }
        });
        } else {
          this.allEntered = true
        }
    }
  }

    reset(){
      this.allEntered = false
      this.repassOk = false
      this.registrationOk = true
      this.userExists = false
      this.timeOk = false
    
      this.name = '';
      this.location = '';
      this.startTime = '00:00';
      this.endTime = '00:00';
    
      this.nameAdmin = '';
      this.surnameAdmin = '';
      this.username = '';
      this.password = '';
      this.repassword = '';
      this.email = '';
    }

}
