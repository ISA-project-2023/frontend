import { Component, OnInit } from '@angular/core';
import { Contract } from '../model/contract.model';
import { CompanyService } from '../company.service';
import { User } from 'src/features/users/model/user.model';
import { UserService } from 'src/features/users/user.service';
import { CompanyAdmin } from 'src/features/users/model/company-admin.model';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css']
})
export class ContractsComponent implements OnInit{
  contracts: Contract[] = [];
  user!:User;
  companyAdmin!:CompanyAdmin;
  constructor(private service: CompanyService, private userService: UserService){

  }

  ngOnInit(): void {
    this.getUser();
  }

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
        this.service.getContracts(this.companyAdmin.company.name).subscribe(
          (result: Contract[])=>{
            this.contracts = result;
          }
        );
      },
      (error) => {
        console.error('Error fetching current logged in company administrator:', error);
      }
    );
  }

  isNotCancelable(contract:Contract):boolean{
    const convertedDate = Array.isArray(contract.date) ? this.convertToDate(contract.date) : contract.date;
    let now = new Date();
    let bound1 = new Date();
    bound1.setDate(now.getDate() + 3);
    let bound2 = new Date();
    bound2.setMonth(now.getMonth() + 1);
    if(convertedDate instanceof Date){
      return !(convertedDate>bound1 && convertedDate<bound2);
    }
    else
      return false;
    
  }

  cancelContract(contract: Contract):void{
    this.service.cancelContract(contract).subscribe(
      (result:Contract)=>{
        this.service.getContracts(this.companyAdmin.company.name).subscribe(
          (res:Contract[])=>{
            this.contracts = res;
          }
        );
      }
    )
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
      return new Date(dateArray[0], dateArray[1]-1, dateArray[2], dateArray[3], dateArray[4]);
    } else {
      return null;
    }
  }

}
