import { Component, EventEmitter, OnChanges, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../model/company.model';
import { Equipment } from '../model/equipment.model';
import { CompanyService } from '../company.service';
import { Reservation } from 'src/features/users/model/reservation';
import { EquipmentAmount } from '../model/equipment-amount.model';

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
  companyEquipment: EquipmentAmount[] = [];
  updatedEquipment: EquipmentAmount[] = [];
  availableEquipment: Equipment[] = [];
  shouldEquipmentUpdate: boolean = false;

  companyReservations: Reservation[] = [];

  constructor(private companyService: CompanyService,
    private route: ActivatedRoute){
      this.route.params.subscribe(params => {
        this.companyId = params['id'];
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
        this.companyEquipment = this.company.equipmentAmountInStock;
        this.updatedEquipment = this.company.equipmentAmountInStock;
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
          this.companyReservations = this.filterReservations(data);
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
        equipmentAmountInStock: this.company?.equipmentAmountInStock,
  
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

  private getPendingEquipment(): Equipment[]{
    let equipments: Equipment[] = [];
    this.companyReservations.forEach(reservation => {
      reservation.equipment.forEach(equipmentAmount => {
        if (!equipments.some(e => e === equipmentAmount.equipment)) {
          equipments.push(equipmentAmount.equipment);
        }
      });
    });
    return equipments;
  }

  canRemoveEquipment(equipment: Equipment): boolean {
    let pendingEquipments = this.getPendingEquipment();
    for (let i = 0; i < pendingEquipments.length; i++) {
      if (equipment.id === pendingEquipments[i].id){
        return false;
      }
    }
    return true;
  }

  removeEquipment(e: Equipment):void{
    if (this.company !== undefined ){
      if (this.canRemoveEquipment(e)){
        const indexToRemove = this.updatedEquipment.findIndex(item => item.equipment.id === e.id);
        this.availableEquipment.push(e);
        this.updatedEquipment.splice(indexToRemove, 1);
      }
      else {
        alert('cant remove this equipment because it is reserved already');
      }
    } 
  }

  addEquipment(e: Equipment):void{
    if (this.company !== undefined){
      const equipmentAmount = {
        equipment: e,
        quantity: 5
      }
      this.updatedEquipment.push(equipmentAmount);
      const indexToRemove = this.availableEquipment.findIndex(item => item.id === e.id);
      this.availableEquipment.splice(indexToRemove);

      this.getAvailableEquipment();
    }
  }

  onQuantityInput(e: any): void {
    let minAmount = 1;
    const inputValue = parseInt(e.target.value, 10);
    if (inputValue <= minAmount) {
      e.target.value = minAmount.toString();
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
        equipment: this.company?.equipment,
        equipmentAmountInStock: this.company?.equipmentAmountInStock
      };
      this.updateCompanyProfile();
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

  search: string = '';
  searchAvailable: string = '';
  searchInStock(): void{
    if(this.search==='' && this.company){
      this.getCompany();
      return;
    }
    this.companyEquipment = this.companyEquipment.filter((eq) =>
    eq.equipment.name.toLowerCase().includes(this.search.toLowerCase()));
  }
  searchAvailableEquipment(): void{
    if(this.searchAvailable==='' && this.company){
      this.getAvailableEquipment();
      return;
    }
    this.availableEquipment = this.availableEquipment.filter((eq) =>
    eq.name.toLowerCase().includes(this.searchAvailable.toLowerCase()));
  }
}
