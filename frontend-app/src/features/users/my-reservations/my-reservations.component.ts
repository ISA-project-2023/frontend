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
  user!: User;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(
      (result: User) => {
        this.user = result;
        this.userService.getCustomersReservations(this.user.id).subscribe(
          (result: Reservation[]) => {
            this.reservations = result;
          },
          (error) => {
            console.log('Error occurred while fetching reservations: ' + error);
          }
        );
      },
      (error) => {
        console.error('Error fetching current user:', error);
      }
    );
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
