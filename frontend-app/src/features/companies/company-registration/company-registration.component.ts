import { Component } from '@angular/core';
import { User } from 'src/features/users/model/user.model';
import { CompanyService } from '../company.service';
import { Company } from '../model/company.model';
import { UserService } from 'src/features/users/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-company-registration',
  templateUrl: './company-registration.component.html',
  styleUrls: ['./company-registration.component.css']
})
export class CompanyRegistrationComponent {

  constructor(private service: CompanyService, private userService: UserService) { }

  allEntered: boolean = false
  repassOk: boolean = false
  registrationOk: boolean = false

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

  user!: User;
  company!: Company;

  save() : void {

    if(this.name === '' || this.location === '' || this.startTime === '' || this.endTime === '' || 
    this.nameAdmin === '' || this.surnameAdmin === '' || this.username === '' || this.password === '' || this.email === ''){
      this.allEntered = true
      this.registrationOk = false
    } else if(this.password !== this.repassword){
      this.repassOk = true
      this.registrationOk = false
    } else {

      this.company = {
        id: 0,
        name: this.name,
        location: this.location,
        grade: 0,
        startTime: (this.startTime + ':00'),
        endTime: (this.endTime + ':00'),
        equipmentInStock: []
      };
      
      this.user = {
        id: 0,
        username: this.username,
        email: this.email,
        penaltyPoints: 0,
        role: 'COMPANY_ADMIN', 
        firstName: this.nameAdmin,
        lastName: this.surnameAdmin,
        category: 'REGULAR'
      };

      

    this.registrationOk = true
    console.log(this.startTime)
    console.log(this.company.startTime)
    }
    console.log(this.company)
    this.service.addCompany(this.company).subscribe({
      next: () => {
      },
      error: () => {}
    });
    this.userService.saveUser(this.user, this.password).subscribe({
      next: () => {
        this.registrationOk = true
        this.allEntered = false
        this.repassOk = false
      },
      error: () => {}
    });
  }
}
