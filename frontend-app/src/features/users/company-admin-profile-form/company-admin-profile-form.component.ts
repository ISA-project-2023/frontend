import { Component, OnChanges, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../model/user.model';
import { CompanyAdmin } from '../model/company-admin.model';

@Component({
  selector: 'xp-company-admin-profile-form',
  templateUrl: './company-admin-profile-form.component.html',
  styleUrls: ['./company-admin-profile-form.component.css']
})
export class CompanyAdminProfileFormComponent implements OnChanges {
  
  @Output() companyAdminProfileUpdated = new EventEmitter<null>();
  @Input() user?: User;
  @Input() companyAdmin?: CompanyAdmin;
  @Input() shouldEdit: boolean = false;
  
  updatedUser!:User;
  updatedCompanyAdmin!: CompanyAdmin;
  emptyString: String = '';

  constructor(private userService: UserService) { }

  companyAdminForm = new FormGroup({
    firstName: new FormControl(this.emptyString, [Validators.required]),
    lastName: new FormControl(this.emptyString, [Validators.required]),
    jobDescription: new FormControl('')
  });

  ngOnChanges(): void {
    this.companyAdminForm.reset();
    
    if(this.shouldEdit) {
      this.companyAdminForm.patchValue({
        firstName: this.user?.firstName,
        lastName: this.user?.lastName,
        jobDescription: this.companyAdmin?.jobDescription
      });  
    }
    // console.log(this.user);
    // console.log(this.companyAdmin);
    if (this.user !== undefined && this.companyAdmin !== undefined){
      this.updatedUser = this.user;
      this.updatedCompanyAdmin = this.companyAdmin;
    } else {
      console.error('couldt fetch data properly');
    }
  }

  updateCompanyAdminProfile(): void{
    if (this.companyAdminForm.value.firstName !== undefined && this.companyAdminForm.value.lastName !== undefined &&
        this.companyAdminForm.value.firstName !== null && this.companyAdminForm.value.lastName !== null &&
        this.companyAdminForm.value.jobDescription !== undefined && this.companyAdminForm.value.jobDescription !== null){
      const editedFirstName : String = this.companyAdminForm.value.firstName;
      const editedLastName : String = this.companyAdminForm.value.lastName;
      const editedjobDescription : string = this.companyAdminForm.value.jobDescription;
      
      // const editedUser: User = {
      //   id: this.updatedUser.id,
      //   username: this.updatedUser.username,
      //   email: this.updatedUser.email,
      //   penaltyPoints: this.updatedUser.penaltyPoints,
      //   role: this.updatedUser.role,
      //   firstName: editedFirstName,
      //   lastName: editedLastName,
      //   category: this.updatedUser.category
      // };
      const editedCompanyAdmin: CompanyAdmin = {
        id: this.updatedCompanyAdmin.id,
        jobDescription: editedjobDescription,
        company: this.updatedCompanyAdmin.company,
        
        username: this.updatedUser.username,
        email: this.updatedUser.email,
        penaltyPoints: this.updatedUser.penaltyPoints,
        role: this.updatedUser.role,
        firstName: editedFirstName,
        lastName: editedLastName,
        category: this.updatedUser.category
      }
      
      this.userService.updateCompanyAdmin(editedCompanyAdmin).subscribe(
        (updatedCompanyAdmin: CompanyAdmin) => {
          this.companyAdmin = updatedCompanyAdmin;
          this.updatedCompanyAdmin = updatedCompanyAdmin;
          
          // this.companyAdmin.user!.firstName = updatedCompanyAdmin.firstName;
          // this.companyAdmin.user!.lastName = updatedCompanyAdmin.lastName;
          this.updatedUser.firstName = updatedCompanyAdmin.firstName;
          this.updatedUser.lastName = updatedCompanyAdmin.lastName;
          //this.user?.firstName updatedCompanyAdmin.firstName;
          //this.user?lastName = updatedCompanyAdmin.lastName;

          alert('Profile updated successfully!');
          this.companyAdminProfileUpdated.emit();
        },
        (error) => {
          console.error('Error in update company administrator:', error);
          return false;
        }
      );

      //this.updatedUser.id = 

      // if (this.updateUserAndCompanyAdmin(editedUser, editedCompanyAdmin)){
      //   alert('Profile updated successfully!');
      //   this.companyAdminProfileUpdated.emit();
      // } else {
      //   console.error('unknown update error: ');
      // }
    } 
    else {
      alert('please fill in form properly!');
    }
  }


  updateUserAndCompanyAdmin(user: User, companyAdmin: CompanyAdmin): boolean {
   this.userService.updateUser(user).subscribe(
      (user: User) => {
        this.user = user;
        this.updatedUser = user;
        //console.log('update user succesful!');
      },
      (error) => {
        console.error('Error in update user:', error);
        return false;
      }
    );

    this.userService.updateCompanyAdmin(companyAdmin).subscribe(
      (updatedCompanyAdmin: CompanyAdmin) => {
        this.companyAdmin = updatedCompanyAdmin;
        this.updatedCompanyAdmin = updatedCompanyAdmin;
        //console.log('update company administrator succesful!');
      },
      (error) => {
        console.error('Error in update company administrator:', error);
        return false;
      }
    );
    
    return true;
  }
}
