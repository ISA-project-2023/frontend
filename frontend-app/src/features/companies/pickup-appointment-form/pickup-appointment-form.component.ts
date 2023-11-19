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

  //dateString: any = '';  
  // customDateValidator = Validators.pattern('^[0-9]{2}-[01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12]-[0-9]{4}[T]{1}[0-2]{1}[0-9]{1}:[0-9]{2}:[0-9]{2}$');
  // appointmentForm = new FormGroup({
  //   date: new FormControl('', [Validators.required, this.customDateValidator]),
  //   duration: new FormControl(0, [Validators.required]),
  // });

  customDateValidator = Validators.pattern('^[0-9]{2}-[01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12]-[0-9]{4}[T]{1}[0-2]{1}[0-9]{1}:[0-9]{2}:[0-9]{2}$');
  appointmentForm = new FormGroup({
    date: new FormControl('', [Validators.required, this.customDateValidator]),
    duration: new FormControl(0, [Validators.required]),
  });


  ngOnInit(): void {
    this.appointmentForm.reset();
    if(this.shouldEdit) {
      this.appointmentForm.patchValue({
        date: this.appointment?.date.toDateString(),
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
          //id: null,
          //date: this.appointmentForm.value.date,
          date: new Date(),
          duration: this.appointmentForm.value.duration,
          isFree: true,
          companyAdmin: this.companyAdmin
        }
        
        console.log(newAppointment);
        // this.dateString = this.appointmentForm.value.date;
        // console.log(this.dateString);
        // this.companyService.addAppointment(newAppointment, this.dateString).subscribe(
        //   response => {
        //     console.log('Appointment saved successfully', response);
        //     this.seeCompanyDetails(this.companyAdmin?.company.id);
        //   },
        //   error => {
        //     console.error('Error! Cant add new appointment:', error);
        //     alert('There was an error while saving the data! Please try again.');
        //   }
        this.companyService.addAppointment(newAppointment).subscribe(
          (appointment: any) => {
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
