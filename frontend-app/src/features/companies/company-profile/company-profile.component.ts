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
  company: Company | undefined;
  equipment: Equipment[] = [];
  canShow: boolean = false; // TODO - only admin van change
  shouldEdit: boolean = false;
  shouldRenderEditForm: boolean = false; 
  
  constructor(private companyService: CompanyService, private activatedRoute : ActivatedRoute) {
    this.activatedRoute.params.subscribe(params=>{
      this.companyId=params['id'];
    });

    if (this.companyId !== undefined){
      this.canShow = true;
    }
    this.getCompany();
  } 
  
  ngOnInit() {
    this.getCompany();
  }

  getCompany(): void {
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

  editCompany(): void{
    this.shouldRenderEditForm = true;
    this.shouldEdit = true;
  }

  onCompanyUpdated(): void {
    this.getCompany();
    this.shouldEdit = false;
    this. shouldRenderEditForm = false;
  }
  
  // deleteCompanyProfile(): void {
  //   this.companyService.deleteCompany(this.companyId).subscribe();
  // }
}
