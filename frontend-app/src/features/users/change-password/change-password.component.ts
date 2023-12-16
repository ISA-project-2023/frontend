import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/features/users/model/user.model';
import { UserService } from 'src/features/users/user.service';

@Component({
  selector: 'xp-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnChanges {

  @Output() passwordChanged = new EventEmitter<null>();
  @Input() shouldEdit: boolean = false;
  @Input() user!: User;

  passwordForm: FormGroup;

  old: string = '';
  password1: string = '';
  password2: string = '';
  
  constructor(private userService: UserService, private fb: FormBuilder, private router: Router) {
    this.passwordForm = this.fb.group({
      //oldPassword: ['', Validators.required],
      password: ['', Validators.required],
      confirm: ['', Validators.required],
    });
    this.getUser();
  }

  ngOnChanges(): void {
    this.passwordForm.patchValue({
      //oldPassword: this.old,
      password: this.password1,
      confirm: this.password2
    });
  }

  getUser(): void{
    this.userService.getCurrentUser().subscribe(
      (user: User) => {
        this.user = user;
      },
      (error) => {
        console.error('Error fetching current user:', error);
      }
    );
  }


  onSubmit() {
    //this.old = this.passwordForm.value.oldPassword;
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
            if(this.user.role === 'SYSTEM_ADMIN'){
              this.updateSystemAdmin();
            }
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

  updateSystemAdmin(): void {
    this.userService.updateSystemAdmin(this.user.id).subscribe(
      (data) => {

      }, 
      (error) => {
        console.log(error);
      }
    );
  }
}
