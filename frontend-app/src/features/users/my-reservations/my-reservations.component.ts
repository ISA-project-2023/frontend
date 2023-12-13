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

}
