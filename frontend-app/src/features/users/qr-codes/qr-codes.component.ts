import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Customer } from '../model/customer.model';
import { Reservation } from '../model/reservation';

@Component({
  selector: 'app-qr-codes',
  templateUrl: './qr-codes.component.html',
  styleUrls: ['./qr-codes.component.css']
})
export class QrCodesComponent implements OnInit{
  customer!: Customer;
  reservations: Reservation[] = [];
  qrCodes: string[] = [];
  constructor(private service: UserService){}
  ngOnInit(): void {
    this.service.getCurrentCustomer().subscribe(
      (result:Customer)=>{
        this.customer = result;
        this.service.getCustomersReservations(this.customer.id).subscribe(
          (result2:Reservation[])=>{
            this.reservations = result2;
            this.service.getCustomersQrCodes(this.customer.id).subscribe(
              (data: any[]) => {
                for(let s of data){
                  this.qrCodes.push("data:image/png;base64," + s);

                }
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
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
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
      ret = ret+e.name+"("+e.description+"), ";
    }
    return ret;
  }
}
