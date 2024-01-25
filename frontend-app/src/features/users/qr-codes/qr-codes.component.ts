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
}
