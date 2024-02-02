import { Component, OnInit } from '@angular/core';
import { Reservation } from '../model/reservation';
import { UserService } from '../user.service';
import { User } from '../model/user.model';

@Component({
  selector: 'app-my-reservations',
  templateUrl: './my-reservations.component.html',
  styleUrls: ['./my-reservations.component.css']
})
export class MyReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  oldReservations: Reservation[] = [];
  user!: User;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(
      (result: User) => {
        this.user = result;
        this.getReservations(this.user);
      },
      (error) => {
        console.error('Error fetching current user:', error);
      }
    );
  }

  getReservations(user: User): void{
    if (user.role === "CUSTOMER") {
      this.userService.getCustomersReservations(this.user.id).subscribe(
        (result: Reservation[]) => {
          this.reservations = result;
        },
        (error) => {
          console.log('Error occurred while fetching reservations: ' + error);
        }
      );
    } else if (user.role === "COMPANY_ADMIN") {
      this.getCompanyAdminsReservations(this.user);
    }
    else{
      console.log('Invalid user! Error occurred while fetching reservations!');
    }
  }

  getCompanyAdminsReservations(user: User): void{
    this.userService.getReservationsByCompanyAdmin(this.user.id).subscribe(
      (result: Reservation[]) => {
        this.reservations = result.filter(r => r.status === 'PENDING');
        this.oldReservations = result.filter(r => r.status !== 'PENDING');

        this.sortReservations(this.reservations);
        this.sortReservations(this.oldReservations);
      },
      (error) => {
        console.log('Error occurred while fetching reservations: ' + error);
      }
    );
  }

  sortReservations(reservations: Reservation[]):void{
    reservations.forEach((reservation) => {
      const convertedDate = Array.isArray(reservation.pickUpAppointment.date) ? this.convertToDate(reservation.pickUpAppointment.date) : reservation.pickUpAppointment.date;
      reservation.pickUpAppointment.date = convertedDate!;
    });
    
    reservations.sort((a, b) => new Date(b.pickUpAppointment.date).getTime() - new Date(a.pickUpAppointment.date).getTime());
  }

  markAsPickedUp(r: Reservation): void{
    const isConfirmed = window.confirm('Are you sure you want to mark this reservation as picked up?');
    
    if (isConfirmed) {
      this.userService.markAsPicked(r.id, r).subscribe(
        (result: Reservation) => {
          console.log('You have marked reservation as picked up.');
          this.ngOnInit();
        },
        (error) => {
          console.error('Error picking up your reservation.');
        }
      );
    } else {
      console.log('Picking up of reservation canceled.');
    }
  }

  cancelReservation(r: Reservation): void {
    const isConfirmed = window.confirm('Are you sure you want to cancel this reservation?');
  
    if (isConfirmed) {
      this.userService.cancelReservation(r.id).subscribe(
        (result: Reservation) => {
          console.log('You have canceled your reservation.');
          this.ngOnInit();
          this.userService.getCurrentUser().subscribe(
            (result: User)=>{
              this.user = result;
            }
          );
        },
        (error) => {
          console.error('Error canceling reservation.');
        }
      );
    } else {
      console.log('Cancellation canceled by user.');
    }
  }
  

  isReservationCanceled(reservation: Reservation): boolean {
    // const convertedDate = Array.isArray(reservation.pickUpAppointment.date) ? this.convertToDate(reservation.pickUpAppointment.date) : reservation.pickUpAppointment.date;
    // let tomorrow = new Date();
    // if(convertedDate!=null){
    //   tomorrow.setDate(tomorrow.getDate() + 1);
    //   if(convertedDate <= tomorrow){
    //     return true;
    //   }
    // }
    return reservation.status === 'CANCELED';
  }

  isReservationPickupPossible(r: Reservation): boolean{
    if (r.status === 'PENDING' && this.isFutureDate(r.pickUpAppointment.date)) {
      return true;
    } else {
      return false;
    }
    return false;
  }

  isFutureDate(date: Date): boolean {
    const convertedDate = Array.isArray(date) ? this.convertToDate(date) : date;
    const currentDate = new Date();
    if (convertedDate! > currentDate){
      return true;
    }
    return false;
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
