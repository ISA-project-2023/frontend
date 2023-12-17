import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/features/users/model/user.model';
import { UserService } from 'src/features/users/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loginForm: FormGroup;
  loggedUser: User | undefined;
  isSystemAdmin: boolean = false;
  isCustomer: boolean = false;
  isCompanyAdmin: boolean = false;
  
  constructor(private router: Router, private userService: UserService, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getCurrentUser();
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
    let user: User | undefined;
    this.userRole(user!);
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
          this.getCurrentUser();
        },
        (error) => {
          console.error('Login error:', error);
          alert("Wrong credentials. Please try again!");
        }
      );
    }
  } 

  getCurrentUser(): void{
    if (!this.isCompanyAdmin && !this.isSystemAdmin && !this.isCustomer) {
      this.userService.getCurrentUser().subscribe(
        (data) => {
          this.loggedUser = data;
          this.userRole(data);
          this.router.navigate(['/home']);
        },
        (error) => {
          this.userRole(this.loggedUser!);
          console.error('cant fetch current user');
        }
      );
    }
  }

  userRole(user: User){
    if (user === undefined){
      this.isSystemAdmin = false;
      this.isCustomer = false;
      this.isCompanyAdmin = false;
    }
    else {
      if (user.role === 'CUSTOMER'){
        this.isSystemAdmin = false;
        this.isCustomer = true;
        this.isCompanyAdmin = false;
      } else if (user.role === 'COMPANY_ADMIN'){
        this.isSystemAdmin = false;
        this.isCustomer = false;
        this.isCompanyAdmin = true;
      } else {
        this.isSystemAdmin = true;
        this.isCustomer = false;
        this.isCompanyAdmin = false;
      }
    }
  }
}
