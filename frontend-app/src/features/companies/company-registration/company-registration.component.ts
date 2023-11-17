import { Component } from '@angular/core';

@Component({
  selector: 'app-company-registration',
  templateUrl: './company-registration.component.html',
  styleUrls: ['./company-registration.component.css']
})
export class CompanyRegistrationComponent {

  name: string = '';
  description: string = '';
  startTime: string = '00:00';
  endTime: string = '00:00';

  save() : void {

  }
}
