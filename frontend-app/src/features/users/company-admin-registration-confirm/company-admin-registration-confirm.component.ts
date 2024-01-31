import { Component, OnChanges, Input, Output, EventEmitter} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../model/user.model';
import { CompanyAdmin } from '../model/company-admin.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-company-admin-registration-confirm',
  templateUrl: './company-admin-registration-confirm.component.html',
  styleUrls: ['./company-admin-registration-confirm.component.css']
})
export class CompanyAdminRegistrationConfirmComponent implements OnChanges {
  @Output() passwordChanged = new EventEmitter<null>();
  @Input() shouldEdit: boolean = false;
  @Input() user!: User;

  userID!: number;
  token!: string;
  passwordForm: FormGroup;

  companyAdmin!: CompanyAdmin;

  constructor(private userService: UserService, private fb: FormBuilder, 
              private activatedRoute : ActivatedRoute, private router: Router) {
    this.activatedRoute.params.subscribe(params=>{
      this.userID = params['id'];  
      this.token = params['token']
    });
    this.getUser();
    this.passwordForm = this.fb.group({
      //oldPassword: ['', Validators.required],
      password: ['', Validators.required],
      confirm: ['', Validators.required],
    });
  }
  
  getUser(): void{
    this.userService.getUser(this.userID).subscribe(
      (user: User) => {
        this.user = user;
        this.userService.getCompanyAdmin(this.userID).subscribe(
          (result: any) => {
            this.companyAdmin = result;
          },
          (error) => {
            console.error('Error fetching companyAdmin:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching user:', error);
      }
    );
  }

  old: string = '';
  password1: string = '';
  password2: string = '';

  ngOnChanges(): void {
    this.passwordForm.patchValue({
      oldPassword: this.old,
      password: this.password1,
      confirm: this.password2
    });
  }
  
  onSubmit() {
    this.old = this.passwordForm.value.oldPassword;
    this.password1 = this.passwordForm.value.password;
    this.password2 = this.passwordForm.value.confirm;

    console.log(this.old);
    console.log(this.password1);
    console.log(this.password2);
    
    if (/*this.old && */ this.password1 && this.password2) {
      if ((this.password1 === this.password2)) {
        this.userService.changePassword(this.user, this.password1).subscribe(
          (data) => {
            this.user = data;
            alert('password changed!')
            this.passwordChanged.emit();
            this.updateCompanyAdmin();
            this.router.navigate(['/home']);
          }, 
          (error) => {
            console.log(error);
          }
        );
      } else {
        alert("please fill the form properly! \nNew password and Confirm new password have to be same!");
      }
    } else {
      alert("please fill the form properly! \nAll fields are necessary!");
    }
    
  } 

  updateCompanyAdmin(): void {
    this.companyAdmin.isVerified = true;
    this.userService.updateCompanyAdmin(this.companyAdmin).subscribe(
      (data) => {
        if(this.token){
          this.userService.activateUser(this.token).subscribe(
            response => {
              console.log('Account activated successfully', response);
            },
            error => {
              console.error('Error activating account', error);
              alert('There was an error while activating the account! Please try again.');
            }
          );
        }
      },
      (error) => {
        console.error('Error updating companyAdmin:', error);
      }
    );
  }
}
