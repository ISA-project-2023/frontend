import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../model/user.model';
import { Employee } from '../model/employee.model';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  employee!: Employee;
  updatedEmployee!:Employee;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getCurrentEmployee().subscribe(
      (employee: Employee) => {
        this.employee = employee;
        this.updatedEmployee = employee;
      },
      (error) => {
        console.error('Error fetching current user:', error);
      }
    );
  }
  updateProfile(event: Event) {
    event.preventDefault();
  
    this.userService.updateEmployee(this.updatedEmployee).subscribe(
      (employee: Employee) => {
        this.employee = employee;
        this.updatedEmployee = employee;
        alert('Profile updated successfully.');
      }
    );
  }
  

}
