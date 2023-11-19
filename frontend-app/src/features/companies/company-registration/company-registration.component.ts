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
  userExists: boolean = false
  timeOk: boolean = false

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
        id: 0,
        name: this.name,
        location: this.location,
        grade: 0,
        startTime: (this.startTime + ':00'),
        endTime: (this.endTime + ':00'),
        equipment: []
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

    console.log(this.company)

    this.service.addCompany(this.company).subscribe({
      next: () => {
      },
      error: () => {
      }
    });

    this.userService.saveUser(this.user, this.password).subscribe({
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
