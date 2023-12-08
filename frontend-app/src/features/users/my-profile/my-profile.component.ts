import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../model/user.model';
import { Customer } from '../model/customer.model';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  customer!: Customer;
  updatedCustomer!:Customer;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getCurrentCustomer().subscribe(
      (customer: Customer) => {
        this.customer = customer;
        this.updatedCustomer = customer;
      },
      (error) => {
        console.error('Error fetching current user:', error);
      }
    );
  }
  updateProfile(event: Event) {
    event.preventDefault();
  
    this.userService.updateCustomer(this.updatedCustomer).subscribe(
      (customer: Customer) => {
        this.customer = customer;
        this.updatedCustomer = customer;
        alert('Profile updated successfully.');
      }
    );
  }
}
