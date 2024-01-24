import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgxScannerQrcodeModule, LOAD_WASM, ScannerQRCodeResult, ScannerQRCodeConfig, NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode';
import { CompanyService } from '../company.service';
import { UserService } from 'src/features/users/user.service';
import { CompanyAdmin } from 'src/features/users/model/company-admin.model';
import { User } from 'src/features/users/model/user.model';
import { Reservation } from '../model/reservation.model';

@Component({
  selector: 'app-accept-reservations',
  templateUrl: './accept-reservations.component.html',
  styleUrls: ['./accept-reservations.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AcceptReservationsComponent implements AfterViewInit, OnDestroy {

  companyAdmin!: CompanyAdmin
  user!: User
  reservations: Reservation[] = []

  constructor(private companyService: CompanyService, private userService: UserService){}

  ngAfterViewInit(): void {
    this.getUser()
    this.action.isReady.subscribe((res: any) => {
      this.handle(this.action, 'start');
    });
  }

  ngOnDestroy(): void {
    this.handle(this.action, 'stop');
  }

  isScannerActive: boolean = true; 
  output!: string;
  isAcceptButtonAllowed: boolean = false;

  @ViewChild('action') action!: NgxScannerQrcodeComponent;

  public config: ScannerQRCodeConfig = {
    constraints: {
      video: {
        width: 600,
        height: 400
      },
    },
  };

  getUser(): void{
    this.userService.getCurrentUser().subscribe(
      (user: User) => {
        this.user = user;
        this.getCompanyAdmin(user);
      },
      (error) => {
        console.error('Error fetching current user:', error);
      }
    );
  }

  getCompanyAdmin(user: User): void{
    this.userService.getCompanyAdmin(user.id).subscribe(
      (compAdmin : CompanyAdmin) => {
        this.companyAdmin = compAdmin;
        this.companyAdmin.username = user.username;
        this.companyAdmin.firstName = this.user.firstName;
        this.companyAdmin.lastName = this.user.lastName;
        this.companyAdmin.email = user.email;
        this.companyAdmin.role = user.role;
        this.companyAdmin.penaltyPoints = user.penaltyPoints;
        this.companyAdmin.category = user.category;
        
        this.getReservationsForCompanyAdmin()
      },
      (error) => {
        console.error('Error fetching current logged in company administrator:', error);
      }
    );
  }

  getReservationsForCompanyAdmin() : void{
    this.companyService.getReservationsForCompanyAdmin(this.companyAdmin.id).subscribe(
      (data) => {
        this.reservations = data
        console.log(this.reservations)
      },
      (error) => {
        alert('Unable to load reservations. Try again later.');
        console.log(error);
      }
    )
  }

  accept() : void {
    let dividedString = this.divideString()
    let company = dividedString[0]
    let customer = dividedString[1]
    let appointment = new Date(dividedString[2])

    for(let r of this.reservations){
      if(r.company.name === company && (r.customer.firstName + ' ' + r.customer.lastName) === customer && this.formatDate(r.pickUpAppointment.date) === this.formatDate(appointment)){
        if(r.status === 'PENDING'){
          this.changeToPickedUp(r.id, r)
          return
        } else {
          alert('Reservation has already been delivered.')
          return
        }
      }
    }
  }

  changeToPickedUp(id: number, reservation: Reservation) : void {
    console.log(id)
    this.companyService.markAsPicked(id, reservation).subscribe(
      response => {
        this.output = ''
        this.isAcceptButtonAllowed = false
        console.log('Reservation delivered', response);
        alert('Reservation delivered!');
      },
      error => {
        console.error('Error delivering reservation', error);
        alert('There was an error while delivering reservation!');
    }
    )
  }

  changeToExpired(id: number) : void {
    this.companyService.markAsExpired(id).subscribe(
      response => {
        this.output = ''
        console.log('Reservation expired', response);
        alert('Reservation expired!');
      },
      error => {
        console.error('Error expiring reservation', error);
        alert('There was an error while expiring reservation!');
    }
    )
  }

  public onEvent(e: ScannerQRCodeResult[], action?: any): void {
    //e && action && action.pause();
    if (this.isScannerActive) {
      console.log(e[0].value);
      this.output = e[0].value;
      this.isScannerActive = false;
      this.checkIfExpired()
      setTimeout(() => {
        this.isScannerActive = true;
      }, 5000);
    }
  }

  divideString() : string[] {
    const dividedString = this.output.split('\n')
    let company = ''
    let customer = ''
    let appointment = ''
    let i = 0
    for(let s of dividedString[1].split(' ')){
      if(i !== 0){
        company += s + ' '
      } 
      i += 1
    }
    company = company.trim()
    i = 0
    for(let s of dividedString[2].split(' ')){
      if(i !== 0){
        customer += s + ' '
      } 
      i += 1
    }
    customer = customer.trim()
    i = 0
    for(let s of dividedString[4].split(' ')){
      if(i !== 0){
        appointment += s + ' '
      } 
      i += 1
    }
    appointment = appointment.trim()

    let result = []
    result.push(company)
    result.push(customer)
    result.push(appointment)

    console.log(result)

    return result
  }

  checkIfExpired() : void {
    let dividedString = this.divideString()
    let company = dividedString[0]
    let customer = dividedString[1]
    let appointment = new Date(dividedString[2])
    let now = new Date()

    for(let r of this.reservations){
      if(r.company.name === company && (r.customer.firstName + ' ' + r.customer.lastName) === customer && this.formatDate(r.pickUpAppointment.date) === this.formatDate(appointment)){
        let appointmentDate = new Date(this.formatDate(r.pickUpAppointment.date))
        if(appointmentDate < now && r.status === 'PENDING'){
          this.isAcceptButtonAllowed = false
          this.changeToExpired(r.id)
          return
        } else if (appointmentDate < now) {
          this.isAcceptButtonAllowed = false
          alert('Reservation has already been marked as expired.')
          return
        }
      }
    }
    this.isAcceptButtonAllowed = true
  }
  
  public handle(action: any, fn: string): void {
    const playDeviceFacingBack = (devices: any[]) => {
      const device = devices.find(f => (/back|rear|environment/gi.test(f.label)));
      console.log(device)
      action.playDevice(device ? device.deviceId : devices[0].deviceId);
    }

    if (fn === 'start') {
      action[fn](playDeviceFacingBack).subscribe((r: any) => console.log(fn, r), alert);
    } else {
      action[fn]().subscribe((r: any) => console.log(fn, r), alert);
    }
  }

  formatDate(date: Date | number[]): string {
    const convertedDate = Array.isArray(date) ? this.convertToDate(date) : date;
    
    if (convertedDate instanceof Date) {
      return convertedDate.toDateString() + ' ' + convertedDate.toLocaleTimeString();
    }
  
    return '';
  }

  convertToDate(dateArray: number[]): Date | null {
    if (dateArray && dateArray.length === 5) {
      return new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);
    } else {
      return null;
    }
  }
}
