import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
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
  passwordError: string = '';

  constructor(private userService: UserService, private router: Router) {} 

  validateForm(): boolean {
    if (this.password !== this.confirmPassword) {
      this.passwordError = 'Passwords do not match';
      return false;
    } else {
      this.passwordError = '';
      return true;
    }
  }

  register(): void {
    if (this.validateForm()) {
      const employee = {
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
        role: 'EMPLOYEE'
      };

      this.userService.saveUser(employee, this.password).subscribe(
        response => {
            console.log('Employee saved successfully', response);
            this.router.navigate(['/home']);
        },
        error => {
            console.error('Error saving employee', error);
            alert('There was an error while saving the data! Please try again.');
        }
    );
    
    }
  }

  onConfirmPasswordInput(): void {
    const registerButton: HTMLButtonElement | null = document.getElementById('registerButton') as HTMLButtonElement | null;

    if (registerButton) {
      registerButton.disabled = this.password !== this.confirmPassword;
    }
  }
}
