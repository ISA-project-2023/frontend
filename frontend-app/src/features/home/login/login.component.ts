import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyAdmin } from 'src/features/users/model/company-admin.model';
import { SystemAdmin } from 'src/features/users/model/system-admin.model';
import { User } from 'src/features/users/model/user.model';
import { UserService } from 'src/features/users/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  @Output() loginChanged = new EventEmitter<null>();
  @Input() shouldEdit: boolean = false;
  @Input() user!: User;

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
  
  isLoggedIn(): boolean {
    return this.userService.isAuthenticated();
  }

  register(){
    this.router.navigate(['/register']);
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
          this.router.navigate(['/home']);
          localStorage.setItem('sessionId', sessionId);
          this.getCurrentUser();
          this.loginChanged.emit();
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
          if(data.role === 'SYSTEM_ADMIN'){
            this.getSystemAdmin();
          }
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

  getSystemAdmin(): void{
    this.userService.getCurrentSystemAdmin().subscribe(
      (admin: SystemAdmin) => {
        if(admin.isActivated === false){
          this.router.navigate(['change-password']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      (error) => {
        console.log('Nije dobavljen ulogovani systemAdmin')
        console.log(error)
      }
    )
  }

  getCompanyAdmin(): void{
    this.userService.getCurrentCompanyAdmin().subscribe(
      (admin: CompanyAdmin) => {
        if(admin.isVerified === false){
          this.router.navigate(['change-password']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      (error) => {
        console.error('Error fetching company admin:', error);
        if (error.status === 500) {
          console.log('Server error. Response body:', error.error);
        }
      }
    );
  }
}
