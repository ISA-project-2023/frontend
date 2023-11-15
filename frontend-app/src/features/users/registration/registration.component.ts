import { Component } from '@angular/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
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

  validateForm(): boolean {
    if (this.password !== this.confirmPassword) {
      this.passwordError = 'Passwords do not match';
      return false;
    } else {
      this.passwordError = '';
      return true;
    }
  }

  onConfirmPasswordInput(): void {
    const registerButton: HTMLButtonElement | null = document.getElementById('registerButton') as HTMLButtonElement | null;

    if (registerButton) {
      registerButton.disabled = this.password !== this.confirmPassword;
    }
  }
}
