import { Component } from '@angular/core';

@Component({
  selector: 'app-company-registration',
  templateUrl: './company-registration.component.html',
  styleUrls: ['./company-registration.component.css']
})
export class CompanyRegistrationComponent {

  name: string = '';
  description: string = '';

  save() : void {

  }
}
