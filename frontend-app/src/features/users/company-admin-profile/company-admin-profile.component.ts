import { Component, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../model/user.model';
import { CompanyAdmin } from '../model/company-admin.model';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import yearGridPlugin from '@fullcalendar/multimonth';
import { Reservation } from '../model/reservation';
//import { Reservation } from 'src/features/companies/model/reservation.model';
import { CompanyService } from 'src/features/companies/company.service';
import { PickUpAppointment } from 'src/features/companies/model/pickup-appointment.model';

@Component({
  selector: 'app-company-admin-profile',
  templateUrl: './company-admin-profile.component.html',
  styleUrls: ['./company-admin-profile.component.css']
})
export class CompanyAdminProfileComponent implements OnInit, OnChanges {
  companyAdmin!: CompanyAdmin; 
  companyId: number = 0;
  shouldEdit: boolean = false;
  shouldRenderEditForm: boolean = false; 

  user!: User;
  updatedUser!:User; 

  reservations!: Reservation[];
  pickUpAppointments!: PickUpAppointment[];
  calendarOptions: CalendarOptions = {
    events: this.getEvents(),
    initialView: 'dayGridMonth',
    eventColor: '#3498db',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek dayGridMonth multiMonthYear',
    },
    plugins: [dayGridPlugin, timeGridPlugin, yearGridPlugin]
  };

  constructor(private userService: UserService, private companyService: CompanyService, private router: Router) { }

  ngOnInit(): void {
    this.getUser()
  }

  ngOnChanges(): void {
    this.getUser();
  }

  getUser(): void{
    this.userService.getCurrentUser().subscribe(
      (user: User) => {
        this.user = user;
        this.updatedUser = user;
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
        this.companyAdmin.username = user.username;
        this.companyAdmin.firstName = this.updatedUser.firstName;
        this.companyAdmin.lastName = this.updatedUser.lastName;
        this.companyAdmin.email = user.email;
        this.companyAdmin.role = user.role;
        this.companyAdmin.penaltyPoints = user.penaltyPoints;
        this.companyAdmin.category = user.category;
        
        this.companyId = compAdmin.company.id;
        
        this.getReservationsForCompanyAdmin()
        this.getPickUpAppointmentsForCompanyAdmin()
      },
      (error) => {
        console.error('Error fetching current logged in company administrator:', error);
      }
    );
  }

  getReservationsForCompanyAdmin() : void {
    this.companyService.getReservationsForCompanyAdmin(this.companyAdmin.id).subscribe(
      (data) => {
        this.reservations = data;
        console.log(this.reservations)
      },
      (error) => {
        alert('Unable to load reservations. Try again later.');
        console.log(error);
      }
    )
  }

  getPickUpAppointmentsForCompanyAdmin() : void {
    this.companyService.getPickUpAppointmentsForCompanyAdmin(this.companyAdmin).subscribe(
      (data) => {
        this.pickUpAppointments = data;
        console.log(this.pickUpAppointments)
        for(let r of this.reservations){
          for(let p of this.pickUpAppointments){
            if(this.formatDate(r.pickUpAppointment.date) === this.formatDate(p.date)){
              const index = this.pickUpAppointments.indexOf(p);
              console.log(index)
              if (index !== -1) {
                this.pickUpAppointments.splice(index, 1);
              }
            }
          }
        }
        console.log(this.pickUpAppointments);
        this.calendarOptions.events = this.getEvents()
      },
      (error) => {
        alert('Unable to load pick up appointments. Try again later.');
        console.log(error);
      }
    )

  }

  editProfile(): void{
    this.shouldRenderEditForm = true;
    this.shouldEdit = true;
  }

  onCompanyAdminUpdated(): void{
    this.shouldEdit = false;
    this.shouldRenderEditForm = false;
    this.getCompanyAdmin(this.updatedUser);
  }

  addNewAppointment(): void {
    this.router.navigate(['company-admin-profile/add-appointment']);
  }

  seeCompanyDetails(): void{
    this.router.navigate(['company-profile/' + this.companyId]);
  }

  getEvents() : any {
    if(this.reservations != undefined){
      for(let r of this.reservations){
        r.pickUpAppointment.date = new Date(this.formatDate(r.pickUpAppointment.date))
      }
      for(let p of this.pickUpAppointments){
        p.date = new Date(this.formatDate(p.date))
      }
      return this.reservations.map(reservation => ({
        title: `${reservation.customer.firstName} ${reservation.customer.lastName}`,
        start: reservation.pickUpAppointment.date,
        type: 'Reservation'
      })).concat(this.pickUpAppointments.map(appointment => ({
        title: `Free appointment`,
        start: appointment.date,
        type: 'Free appointment'
      })));
    }
  }

  formatDate(date: Date | number[]): string {
    const convertedDate = Array.isArray(date) ? this.convertToDate(date) : date;
    
    if (convertedDate instanceof Date) {
      return convertedDate.toDateString() + ' ' + convertedDate.toLocaleTimeString();
    }
  
    return '';
  }

  convertToDate(dateArray: number[]): Date | null {
    if (dateArray && dateArray.length === 5) {
      return new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);
    } else {
      return null;
    }
  }
}
