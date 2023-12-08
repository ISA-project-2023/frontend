import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { User } from '../model/user.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit{
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  firstName: string = '';
  lastName: string = '';
  city: string = '';
  country: string = '';
  phoneNumber: string = '';
  profession: string = '';
  companyInfo: string = '';
  users: User[] = [];

  constructor(private userService: UserService, private router: Router) {} 

  ngOnInit(){
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
      const customer = {
        username: this.username,
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword,
        firstName: this.firstName,
        lastName: this.lastName,
        city: this.city,
        country: this.country,
        phoneNumber: this.phoneNumber,
        profession: this.profession,
        companyInfo: this.companyInfo,
        role: 'CUSTOMER'
      };

      for(let user of this.users){
        if(user.email === customer.email){
          console.error('Email duplicate.');
          alert('The entered email is already used!');
          break;
        }
      }

      this.userService.saveUser(customer, this.password).subscribe(
        response => {
            console.log('Customer saved successfully', response);
            this.router.navigate(['/home']);
        },
        error => {
            console.error('Error saving customer', error);
            alert('There was an error while saving the data! Please try again.');
        }
    );
    
    }
    else{
      alert('Passwords do not match');
    }
  }

  onConfirmPasswordInput(): void {
    const registerButton: HTMLButtonElement | null = document.getElementById('registerButton') as HTMLButtonElement | null;

    if (registerButton) {
      registerButton.disabled = this.password !== this.confirmPassword;
    }
  }
}
