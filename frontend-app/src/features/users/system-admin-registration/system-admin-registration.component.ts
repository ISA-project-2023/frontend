import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { User } from '../model/user.model';

@Component({
  selector: 'app-system-admin-registration',
  templateUrl: './system-admin-registration.component.html',
  styleUrls: ['./system-admin-registration.component.css']
})
export class SystemAdminRegistrationComponent implements OnInit {

  constructor(private userService: UserService, private router: Router){}

  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  firstName: string = '';
  lastName: string = '';
  city: string = '';
  country: string = '';
  phoneNumber: string = '';

  users: User[] = [];

  ngOnInit(): void {
    this.userService.getUsers().subscribe(
      (result)=>{
        this.users = result;
      }
    )
  }

  validateForm(): boolean {
    if (this.password !== this.confirmPassword) {
      return false;
    } else {
      return true;
    }
  }

  register(): void {
    if (this.validateForm()) {
      const admin = {
        username: this.username,
        email: this.email,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName,
        penaltyPoints: 0,
        category: 'kategorija',
        role: 'SYSTEM_ADMIN',
        isActivated: false
      };

      for(let user of this.users){
        if(user.email === admin.email){
          console.error('Email duplicate.');
          alert('The entered email is already used!');
          break;
        }
      }

      this.userService.saveSystemAdmin(admin, this.password).subscribe(
        response => {
            console.log('Admin saved successfully', response);
            alert('Admin saved successfully!');
            this.router.navigate(['system-admin-profile']);
        },
        error => {
            console.error('Error saving admin', error);
            alert('There was an error while saving the data! Please try again.');
        }
    );
    
    }
    else{
      alert('Passwords do not match');
    }
  }
}
