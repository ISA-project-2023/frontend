import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../model/company.model';
import { Equipment } from '../model/equipment.model';
import { CompanyService } from '../company.service';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {
  companyId: number = 0;
  companies: Company[] = []; 
  company: Company | undefined;
  canShow: boolean = false;
  equipment: Equipment[] = [];
  
  constructor(private companyService: CompanyService, private activatedRoute : ActivatedRoute) {
    this.activatedRoute.params.subscribe(params=>{
      this.companyId=params['id'];
    });

    if (this.companyId !== undefined){
      this.canShow = true;
    }
    this.getCompany(this.companyId);
  } 
  
  ngOnInit() {
    this.companyService.getCompany(this.companyId).subscribe(
      (data) => {
        this.company = data;
        this.equipment = this.company.equipment;
      },
      (error) => {
        alert('Unable to load company. Try again later.');
      }
    );
  }

  getCompany(id: number): void {
    this.companyService.getCompany(id).subscribe(
      (data) => {
        this.company = data;
      },
      (error) => {
        alert('Unable to load company. Try again later.');
      }
    );
  }

  // updateCompanyProfile(): void {
  //   this.companyService.updateCompany(this.company).subscribe({
  //     next: () => {},
  //     error: () => {}
  //   });
  // }
  
  // deleteCompanyProfile(): void {
  //   this.companyService.deleteCompany(this.companyId).subscribe();
  // }
}
