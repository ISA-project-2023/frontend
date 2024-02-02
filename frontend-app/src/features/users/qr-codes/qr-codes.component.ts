import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Customer } from '../model/customer.model';
import { Reservation } from '../model/reservation';

@Component({
  selector: 'app-qr-codes',
  templateUrl: './qr-codes.component.html',
  styleUrls: ['./qr-codes.component.css']
})
export class QrCodesComponent implements OnInit {
  customer!: Customer;
  allReservations: Reservation[] = [];
  allQrCodes: string[] = [];
  reservations: Reservation[] = [];
  qrCodes: string[] = [];
  pendingReservations: Reservation[] = [];
  pendingQrCodes: string[] = [];
  canceledReservations: Reservation[] = [];
  canceledQrCodes: string[] = [];

  constructor(private service: UserService) {}

  ngOnInit(): void {
    this.service.getCurrentCustomer().subscribe(
      (result: Customer) => {
        this.customer = result;
        this.loadData();
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  loadData(): void {
    this.service.getCustomersReservations(this.customer.id).subscribe(
      (result2: Reservation[]) => {
        this.allReservations = result2;
        this.reservations = [...this.allReservations];
        this.service.getCustomersQrCodes(this.customer.id).subscribe(
          (data: any[]) => {
            this.allQrCodes = data.map((s) => "data:image/png;base64," + s);
            this.qrCodes = [...this.allQrCodes];
          },
          (error) => {
            console.error('Error fetching data:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  showPending(): void {
    this.pendingReservations = this.allReservations.filter((r) => r.status === 'PENDING');
    this.pendingQrCodes = this.allQrCodes.slice(0, this.pendingReservations.length);
    this.reservations = this.pendingReservations;
    this.qrCodes = this.pendingQrCodes;
  }

  showCanceled(): void {
    this.canceledReservations = this.allReservations.filter((r) => r.status === 'CANCELED');
    this.canceledQrCodes = this.allQrCodes.slice(0, this.canceledReservations.length);
    this.reservations = this.canceledReservations;
    this.qrCodes = this.canceledQrCodes;
  }

  showAll(): void {
    this.reservations = [...this.allReservations];
    this.qrCodes = [...this.allQrCodes];
  }
  onSelectionChange(event: any) {
    const selectedOption = event.target.value;
  
    if (selectedOption === 'All') {
      this.showAll();
    } else if (selectedOption === 'Pending') {
      this.showPending();
    } else if (selectedOption === 'Canceled') {
      this.showCanceled();
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

  getEq(res:Reservation):string{
    let ret = "";
    for(let e of res.equipment){
      ret = ret+e.equipment.name+"("+e.equipment.description+"), ";
    }
    return ret;
  }
}
