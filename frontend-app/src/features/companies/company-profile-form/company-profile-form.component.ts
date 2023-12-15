import { Component, EventEmitter, OnChanges, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../model/company.model';
import { Equipment } from '../model/equipment.model';
import { CompanyService } from '../company.service';

@Component({
  selector: 'xp-company-profile-form',
  templateUrl: './company-profile-form.component.html',
  styleUrls: ['./company-profile-form.component.css']
})
export class CompanyProfileFormComponent implements OnChanges {

  @Output() companyProfileUpdated = new EventEmitter<null>();
  @Input() company?: Company;
  @Input() shouldEdit: boolean = false;
  
  companyId: number = 0;
  equipment: Equipment[] = [];
  availableEquipment: Equipment[] = [];
  //TODO - company available equipment update

  constructor(private companyService: CompanyService,
    private route: ActivatedRoute){
      this.route.params.subscribe(params => {
        this.companyId = params['id'];
        console.log(this.companyId);
        this.getCompany();
        this.getAvailableEquipment();
      });
  }

  ngOnChanges(): void {
    this.companyProfileForm.reset();
    if(this.shouldEdit) {
      this.companyProfileForm.patchValue({
        name: this.company?.name,
        location: this.company?.location,
        grade: this.company?.grade
      });  
    }
  }

  companyProfileForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    grade: new FormControl(0, [Validators.required]),
    //equipment: new FormControl<Equipment>([], {nonNullable: false})
  });
  
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

  getAvailableEquipment(): void {
    this.companyService.getEquipment().subscribe(
      (data) => {
        this.availableEquipment = data;
        
        // Remove company equipment from available equipment
        this.availableEquipment = this.availableEquipment.filter(
          (equipment) => !this.isEquipmentInCompany(equipment)
        );
      },
      (error) => {
        alert('Unable to load equipment. Try again later.');
      }
    );
  }

  // Helper function to check if equipment is in the company
  private isEquipmentInCompany(equipment: any): boolean {
    return this.company!.equipment.some(
      (companyEquipment) => companyEquipment.id === equipment.id
    );
  }

  updateCompanyProfile(): void {    
    if (this.company !== undefined){
      const comp: Company = {
        id: this.company?.id || 0,
        startTime: this.company?.startTime || "",
        endTime: this.company?.endTime || "",
        equipment: this.company?.equipment || this.equipment,
  
        name: this.companyProfileForm.value.name as string || "",
        location: this.companyProfileForm.value.location as string || '',
        grade: Number(this.companyProfileForm.value.grade) || 0,
      };
      this.companyService.updateCompany(comp).subscribe({
        next: () => {
          this.companyProfileUpdated.emit();
          this.companyProfileForm.reset();
        },
        error: () => {}
      });
    } else {
      alert('cant update company');
    }
  }
}
