import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PickUpAppointment } from '../model/pickup-appointment.model';
import { CompanyService } from '../company.service';
import { CompanyAdmin } from 'src/features/users/model/company-admin.model';
import { User } from 'src/features/users/model/user.model';
import { UserService } from 'src/features/users/user.service';

@Component({
  selector: 'xp-pickup-appointment-form',
  templateUrl: './pickup-appointment-form.component.html',
  styleUrls: ['./pickup-appointment-form.component.css']
})
export class PickupAppointmentFormComponent implements OnInit {
  constructor(private companyService: CompanyService, private userService: UserService, 
    private router: Router) {}
  
  user!: User;
  newAppointment!: PickUpAppointment;

  appointment?: PickUpAppointment;
  companyAdmin?: CompanyAdmin;
  shouldEdit: boolean = false;

  appointmentForm = new FormGroup({
    date: new FormControl(new Date(), [Validators.required]),
    duration: new FormControl(0, [Validators.required]),
  });


  ngOnInit(): void {
    this.appointmentForm.reset();
    if(this.shouldEdit) {
      this.appointmentForm.patchValue({
        date: this.appointment?.date,
        duration: this.appointment?.duration
      });  
    }
    this.getUser();
  }

  getUser(): void{
    this.userService.getCurrentUser().subscribe(
      (user: User) => {
        this.user = user;
        this.getCompanyAdmin(user);
      },
      (error) => {
        console.error('Error fetching current user:', error);
      }
    );
  }

  getCompanyAdmin(user: User): void{
    this.userService.getCompanyAdmin(user.id).subscribe(
      (compAdmin : CompanyAdmin) => {
        this.companyAdmin = compAdmin;
        this.companyAdmin.user = user;
      },
      (error) => {
        console.error('Error fetching current logged in company administrator:', error);
      }
    );
  }

  addNewAppointment(): void{
    if( this.appointmentForm.value.date !== undefined || this.appointmentForm.value.date !== null ||
        this.appointmentForm.value.duration !== undefined || this.appointmentForm.value.duration !== null) {
        const newAppointment = {
          date: this.appointmentForm.value.date,
          duration: this.appointmentForm.value.duration,
          isFree: true,
          companyAdmin: this.companyAdmin
        }

        this.companyService.addAppointment(newAppointment).subscribe(
          (appointment: PickUpAppointment) => {
            this.newAppointment = appointment;
            console.log(this.newAppointment);
            this.seeCompanyDetails(appointment.companyAdmin.company.id);
          },
          (error) => {
            console.error('Error! Cant add new appointment:', error);
          }
        );
      } else {
        alert('please fill in form properly!');
    }
  }

  seeCompanyDetails(companyId: any): void{
    this.router.navigate(['company-profile/' + companyId]);
  }
}
