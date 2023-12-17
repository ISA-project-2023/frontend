import { Component, EventEmitter, OnChanges, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../model/company.model';
import { Equipment } from '../model/equipment.model';
import { CompanyService } from '../company.service';
import { Reservation } from 'src/features/users/model/reservation';

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
  updatedEquipment: Equipment[] = [];
  availableEquipment: Equipment[] = [];
  shouldEquipmentUpdate: boolean = false;

  comapanyReservations: Reservation[] = [];

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
    this.getCompany();
    this.getAvailableEquipment();
  }

  companyProfileForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    grade: new FormControl(0, [Validators.required]),
  });
  
  getCompany(): void {
    this.companyService.getCompany(this.companyId).subscribe(
      (data) => {
        this.company = data;
        this.updatedEquipment = this.company.equipment;
        this.getReservations();
      },
      (error) => {
        alert('Unable to load company. Try again later.');
      }
    );
  }

  getReservations(): void{
    if (this.company !== undefined){
      this.companyService.getReservationsByCompany(this.company.id).subscribe(
        (data) => {
          this.comapanyReservations = this.filterReservations(data);
        },
        (error) => {
          console.error('Unable to load reservations for company.');
        }
      );
    } else {
      console.error('Unable to load reservations for company. Company isnt loaded.');
    } 
  }
  
  filterReservations(data: Reservation[]): Reservation[]{
      return data.filter(reservation => (reservation.status === "PENDING"));
  }

  updateCompanyProfile(): void {    
    if (this.company !== undefined){
      const comp: Company = {
        id: this.company?.id || 0,
        startTime: this.company?.startTime || "",
        endTime: this.company?.endTime || "",
        equipment: this.company?.equipment || this.updatedEquipment,
  
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

  // company equipment update
  openEquipmentUpdate(): void{
    this.shouldEquipmentUpdate = true;
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

  private isEquipmentInCompany(equipment: any): boolean {
    return this.company!.equipment.some(
      (companyEquipment) => companyEquipment.id === equipment.id
    );
  }

  private canRemoveEquipment(equipment: Equipment): boolean {
    const result = this.comapanyReservations.every(reservation => {
      const hasEquipment = reservation.equipment.some(reservedEquipment => reservedEquipment.id === equipment.id);
      //console.log(`Reservation ${reservation.id}: Equipment present - ${hasEquipment}`);
      return !hasEquipment;
    });
    //console.log('Can remove equipment:', result);
    return result;
  }

  removeEquipment(e: Equipment):void{
    if (this.company !== undefined ){
      if (this.canRemoveEquipment(e)){
        const indexToRemove = this.updatedEquipment.findIndex(item => item.id === e.id);
        this.availableEquipment.push(e);
        this.updatedEquipment.splice(indexToRemove, 1);
  
        this.getAvailableEquipment();
      }
      else {
        alert('cant remove this equipment because it is reserved already');
      }
    } 
  }

  addEquipment(e: Equipment):void{
    if (this.company !== undefined){
      this.updatedEquipment.push(e);
      const indexToRemove = this.availableEquipment.findIndex(item => item.id === e.id);
      this.availableEquipment.splice(indexToRemove);

      this.getAvailableEquipment();
    }
  }

  updateCompanyEquipment(): void {    
    if (this.company !== undefined){
      const comp: Company = {
        id: this.company?.id || 0,
        name: this.companyProfileForm.value.name as string || "",
        location: this.companyProfileForm.value.location as string || '',
        grade: Number(this.companyProfileForm.value.grade) || 0,
        startTime: this.company?.startTime || "",
        endTime: this.company?.endTime || "",
        equipment: this.updatedEquipment,
      };
      this.companyService.updateCompanyEquipment(comp).subscribe({
        next: () => {
          this.companyProfileUpdated.emit();
          this.companyProfileForm.reset();
        },
        error: () => {}
      });
      this.shouldEquipmentUpdate = false;
    } else {
      alert('cant update company equipment');
    }
  }
}
