import { Component } from '@angular/core';
import { Company } from '../model/company.model';
import { Equipment } from '../model/equipment.model';
import { CompanyService } from '../company.service';

@Component({
  selector: 'app-search-equipment',
  templateUrl: './search-equipment.component.html',
  styleUrls: ['./search-equipment.component.css']
})
export class SearchEquipmentComponent {
  companies: Company[] = [];
  equipment: Equipment[] = [];
  filteredCompanies: Company[] = [];
  filteredEquipment: Equipment[] = [];
  searchName: string = '';
  gradeFilter: number = 0.0;

  constructor(private companyService: CompanyService) {} 


  ngOnInit() {
    this.companyService.getCompanies().subscribe(
      (data) => {
        this.companies = data;
        console.log(this.companies);
      },
      (error) => {
        alert('Unable to load companies. Try again later.');
      }
    );
  }

  search() {
    this.filteredEquipment = [];

    this.companies.forEach((company) => {
    
    const filteredEquipmentInCompany = company.equipment.filter((eq) =>
      eq.name.toLowerCase().includes(this.searchName.toLowerCase())
    );

    this.filteredEquipment = this.filteredEquipment.concat(filteredEquipmentInCompany);

    this.filteredEquipment = this.filteredEquipment.filter(
      (equipment, index, self) =>
        index === self.findIndex((e) => e.id === equipment.id && e.name === equipment.name && e.type === equipment.type && e.description === equipment.description)
    );
  });
    console.log(this.searchName)
    this.gradeFilter = 0.0;
  }

  reset(){
    this.filteredEquipment = [];
    this.filteredCompanies = [];
    this.searchName = '';
    this.gradeFilter = 0.0;
  }

  onRowClick(eq: Equipment){
    this.filteredCompanies = [];
    this.companies.forEach((company) => {
      company.equipment.forEach((equip) => {
        if((equip.name === eq.name)){
          this.filteredCompanies.push(company)
        }
      })
    });
    this.filteredCompanies = this.filteredCompanies.filter(
      (company, index, self) =>
        index === self.findIndex((e) => e.id === company.id && e.name === company.name && e.endTime === company.endTime && e.startTime === company.startTime && e.grade === company.grade && e.equipment === company.equipment && e.location === company.location)
    );
  }

  filter(){
    this.filteredCompanies = this.companies.filter((company) =>
      company.grade>=this.gradeFilter
    );
  }
}
