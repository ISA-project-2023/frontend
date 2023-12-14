import { Component, OnInit } from '@angular/core';
import { Reservation } from '../model/reservation';
import { UserService } from '../user.service';
import { User } from '../model/user.model';

@Component({
  selector: 'app-my-reservations',
  templateUrl: './my-reservations.component.html',
  styleUrls: ['./my-reservations.component.css']
})
export class MyReservationsComponent implements OnInit{
  reservations: Reservation[] = [];
  user!: User;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(
      (result: User) => {
        this.user = result;
        this.userService.getCustomersReservations(this.user.id).subscribe(
          (result: Reservation[])=>{
            this.reservations = result;
            console.log(this.reservations[0].pickUpAppointment.date);
          },
          (error)=>{
            console.log('Error occured while fetching reservations: ' + error);
          }
        )
      },
      (error) => {
        console.error('Error fetching current user:', error);
      }
    );
  }
  
  convertToDate(dateArray: number[]): Date | null {
    if (dateArray && dateArray.length === 7) {
      return new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4], dateArray[5], dateArray[6]);
    } else {
      return null;
    }
  }
}
