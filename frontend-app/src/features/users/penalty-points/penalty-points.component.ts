import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../model/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-penalty-points',
  templateUrl: './penalty-points.component.html',
  styleUrls: ['./penalty-points.component.css']
})
export class PenaltyPointsComponent implements OnInit {
  user!:User;
  constructor(private userService: UserService, private router: Router) { }
  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(
      (result: User) => {
        this.user = result;
      },
      (error) => {
        console.error('Error fetching current user:', error);
      }
    );
  }
  goBack():void{
    this.router.navigate(['/']);
  }
}
