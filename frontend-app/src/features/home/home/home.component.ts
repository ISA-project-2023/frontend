import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/features/users/model/user.model';
import { UserService } from 'src/features/users/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  loginForm: FormGroup;
  loggedUser: User | undefined;
  
  constructor(private router: Router, private userService: UserService, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  toggleSidebar() {
    var sidebar = document.getElementById('sidebar');
  
    if (sidebar) {
      sidebar.style.display = (sidebar.style.display === 'none' || sidebar.style.display === '') ? 'block' : 'none';
    } else {
      console.error('Sidebar element not found.');
    }
  }
  
  navigateToCompanies() {
    this.router.navigate(['/companiesReview']);
  }

  navigateToCompanyRegistration() {
    this.router.navigate(['/companyRegistration']);
  }

  navigateToEquipmentSearch() {
    this.router.navigate(['/searchEquipment']);
  }
  
  navigateToMyProfile(){
    this.router.navigate(['/my-profile']);
  }

  navigateToCompanyAdminProfile(){
    this.router.navigate(['/company-admin-profile']);
  }

  navigateToMyReservations(){
    this.router.navigate(['/my-reservations']);
  }

  navigateToSystemAdminProfile(){
    this.router.navigate(['/system-admin-profile'])
  }
  
  logout() {
    this.userService.logout().subscribe(
      (response) => {
        if(response === 'Logout successful'){
          this.router.navigate(['/home']);
        }
        else {
          console.error('Unexpected response:', response);
        }
      },
      (error) => {
        console.error('Logout error:', error);
      }
    );
  }

  register(){
    this.router.navigate(['/register']);
  }

  isLoggedIn(): boolean {
    return this.userService.isAuthenticated();
  }

  onSubmit() {
    const usernameControl = this.loginForm.get('username');
    const passwordControl = this.loginForm.get('password');
  
    if (usernameControl && passwordControl) {
      const credentials = {
        username: usernameControl.value,
        password: passwordControl.value
      };
  
      this.userService.login(credentials).subscribe(
        (sessionId) => {
          localStorage.setItem('sessionId', sessionId);
          this.router.navigate(['/home']);
        },
        (error) => {
          console.error('Login error:', error);
          alert("Wrong credentials. Please try again!");
        }
      );
    }
  } 
}
