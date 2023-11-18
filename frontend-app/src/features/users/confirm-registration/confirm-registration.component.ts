import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-confirm-registration',
  templateUrl: './confirm-registration.component.html',
  styleUrls: ['./confirm-registration.component.css']
})
export class ConfirmRegistrationComponent implements OnInit {
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    const token = this.router.url.split('/').pop();
    if(token){
      this.userService.activateUser(token).subscribe(
        response => {
          console.log('Account activated successfully', response);
        },
        error => {
          console.error('Error activating account', error);
          alert('There was an error while activating the account! Please try again.');
        }
      );
    }
    
  }
}