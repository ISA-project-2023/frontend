import { Component, OnInit } from '@angular/core';
import { Company } from '../model/company.model';
import { CompanyService } from '../company.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  companies: Company[] = [];
  filteredCompanies: Company[] = [];
  searchLocation: string = '';
  searchName: string = '';
  gradeFilter: number = 0.0;

  constructor(private companyService: CompanyService) {} 

  ngOnInit() {
    this.companyService.getCompanies().subscribe(
      (data) => {
        this.companies = data;
        this.filteredCompanies = data;
        console.log(this.companies);
      },
      (error) => {
        alert('Unable to load companies. Try again later.');
      }
    );
  }

  search() {
    this.filteredCompanies = this.companies.filter((company) =>
      company.location.toLowerCase().includes(this.searchLocation.toLowerCase()) &&
      company.name.toLowerCase().includes(this.searchName.toLowerCase())
    );
    this.gradeFilter = 0.0;
  }
  reset(){
    this.filteredCompanies = this.companies;
    this.searchLocation = '';
    this.searchName = '';
    this.gradeFilter = 0.0;
  }
  filter(){
    this.filteredCompanies = this.companies.filter((company) =>
      company.location.toLowerCase().includes(this.searchLocation.toLowerCase()) &&
      company.name.toLowerCase().includes(this.searchName.toLowerCase()) &&
      company.grade>=this.gradeFilter
    );
  }

}
