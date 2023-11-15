import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../model/user.model';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  user!: User;
  updatedUser!:User;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(
      (user: User) => {
        this.user = user;
        this.updatedUser = user;
      },
      (error) => {
        console.error('Error fetching current user:', error);
      }
    );
  }
  updateProfile(event: Event) {
    event.preventDefault();
  
    this.userService.updateUser(this.updatedUser).subscribe(
      (user: User) => {
        this.user = user;
        this.updatedUser = user;
        alert('Profile updated successfully.');
      }
    );
  }
  

}
