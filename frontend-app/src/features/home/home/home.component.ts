import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/features/users/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private router: Router, private userService: UserService) {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToCompanies() {
    this.router.navigate(['/companiesReview']);
  }
  
  navigateToMyProfile(){
    this.router.navigate(['/my-profile'])
  }

  navigateToCompanyAdminProfile(){
    this.router.navigate(['/company-admin-profile'])
  }
  
  logout() {
    this.userService.logout().subscribe(
      () => {
        this.router.navigate(['/login']);
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
}
