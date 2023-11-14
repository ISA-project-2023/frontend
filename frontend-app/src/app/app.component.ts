import { Component, OnInit } from '@angular/core';
import { UserService } from '../features/users/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend-app';

  //just for testing connection to the back-end
  nista: any;

  constructor(private userService: UserService) {} 

  ngOnInit() {
    this.userService.getData().subscribe((data) => {
      this.nista = data;
    });
  }
  //end of testing
}
