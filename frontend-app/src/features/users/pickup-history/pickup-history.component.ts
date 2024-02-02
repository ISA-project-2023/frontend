import { Component, OnInit } from '@angular/core';
import { Reservation } from '../model/reservation';
import { UserService } from '../user.service';
import { User } from '../model/user.model';


@Component({
  selector: 'app-pickup-history',
  templateUrl: './pickup-history.component.html',
  styleUrls: ['./pickup-history.component.css']
})
export class PickupHistoryComponent  implements OnInit {
  reservations: Reservation[] = [];
  user!: User;
  dateOrderAsc:boolean = true;
  durationOrderAsc:boolean = true;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(
      (result: User) => {
        this.user = result;
        this.userService.getPreviousCustomersReservations(this.user.id).subscribe(
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

  sortByDate():void{
    this.reservations.sort((a, b) => {
      const dateA = Array.isArray(a.pickUpAppointment.date) ? this.convertToDate(a.pickUpAppointment.date): null;
      const dateB = Array.isArray(b.pickUpAppointment.date) ? this.convertToDate(b.pickUpAppointment.date): null;
      if (dateA && dateB) {
        this.dateOrderAsc = !this.dateOrderAsc;
        return dateA.getTime() - dateB.getTime();
      }
      return 0;
    });
  }

  sortByDuration():void{
    this.reservations.sort((a, b) => {
        this.durationOrderAsc = !this.durationOrderAsc;
        return a.pickUpAppointment.duration - b.pickUpAppointment.duration;
    });
  }
  
}
