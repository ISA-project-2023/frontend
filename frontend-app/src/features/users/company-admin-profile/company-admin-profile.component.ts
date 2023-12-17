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
  calendarOptions: CalendarOptions = {
    events: this.getEvents(),
    initialView: 'dayGridMonth',
    eventColor: '#4caf50',
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
      },
      (error) => {
        console.error('Error fetching current logged in company administrator:', error);
      }
    );
  }

  getReservationsForCompanyAdmin() : void{
    this.companyService.getReservationsForCompanyAdmin(this.companyAdmin.id).subscribe(
      (data) => {
        this.reservations = data;
        console.log(this.reservations)
        this.calendarOptions.events = this.getEvents()
      },
      (error) => {
        alert('Unable to load reservations. Try again later.');
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
      return this.reservations.map(reservation => ({
        title: `${reservation.customer.firstName} ${reservation.customer.lastName}`,
        start: reservation.pickUpAppointment.date
      }));
    }
  }
}
