import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Company } from '../model/company.model';
import { Equipment } from '../model/equipment.model';
import { CompanyService } from '../company.service';
import { CompanyAdmin } from 'src/features/users/model/company-admin.model';
import { User } from 'src/features/users/model/user.model';
import { UserService } from 'src/features/users/user.service';
import { PickUpAppointment } from '../model/pickup-appointment.model';
import { Reservation } from 'src/features/users/model/reservation';
import { EquipmentAmount } from '../model/equipment-amount.model';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css'],
  providers: [DatePipe]
})
export class CompanyProfileComponent implements OnInit {
  @ViewChild('pickup') companyProfile!: ElementRef;
  companyId: number = 0;
  company: Company | undefined;
  equipment: EquipmentAmount[] = [];
  admins: CompanyAdmin[] = [];
  appointments: PickUpAppointment[] = [];
  users: User[] = [];
  canShow: boolean = false;
  shouldEdit: boolean = false;
  shouldRenderEditForm: boolean = false; 
  user: User|undefined; 
  companyAdmin: CompanyAdmin|undefined;
  search: string = '';
  cart: EquipmentAmount[] = [];
  availableAppointments: boolean = false;
  selectedAppointment?: PickUpAppointment;
  selectedDate:Date|undefined;
  reservation: Reservation = {
    id: 0,
    company: undefined!,
    customer: undefined!,
    pickUpAppointment: undefined!,
    status: '',
    equipment: undefined!
  };
  comapanyReservations: Reservation[] = [];
  
  constructor(private companyService: CompanyService, private userService: UserService, private activatedRoute : ActivatedRoute, private router: Router) {
    this.activatedRoute.params.subscribe(params=>{
      this.companyId=params['id'];  
    });
    userService.getCurrentUser().subscribe({
      next:(result)=>{
        this.user = result;
        this.getCompany();
      }
    });

    if (this.companyId !== undefined){
      this.canShow = true;
    }
  }

  scrollToElement() {
    setTimeout(() => {
      if (this.companyProfile && this.companyProfile.nativeElement) {
        this.companyProfile.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);
  }
  
  ngOnInit() {
    this.getCompany();
  }

  canCompanyAdminSee(): boolean{
    if (this.user?.role === 'COMPANY_ADMIN'){
      const compAdmin = this.admins.find(admin=> admin.id===this.user!.id);
      if (compAdmin === undefined){
        return false;
      }
    }
    return true;
  }

  filterAppointments(data: PickUpAppointment[]): PickUpAppointment[] {
    if(this.user?.role==='CUSTOMER')
      return data.filter(ap => ap.isFree);
    else
      return data;
  }

  selectAppointment(a: PickUpAppointment){
    if(!confirm('Are you sure you want to create reservation?')){
      return;
    }
    this.reservation.company = this.company!;
    this.reservation.equipment = this.cart;
    this.reservation.status = "PENDING";
    
    this.userService.getCustomer(this.user!.id).subscribe(
      (result)=>{
        if(result.penaltyPoints>=3){
          alert('You cannot finish this reservation because you have 3 or more penalty points.');
          return;
        }
        this.reservation.customer = result;
        this.reservation.pickUpAppointment = a;
        this.userService.makeReservation(this.reservation).subscribe(
          (result)=>{
            if(result){
              console.log("Pickup appointment added.");
              this.router.navigate(['/my-reservations']);
            }
          },
          (error)=>{
            console.error("Error while making reservation: " + error);
          }
        )
      },
      (error)=>{
        console.log('Error: ' + error);
      }
    )
  }

  AddToCart(e:Equipment){
    const equipmentAmount = {
      equipment: e,
      quantity: 5
    }
    const indexToRemove = this.cart.findIndex(item => item.equipment === e);
    if (indexToRemove === -1) {
      this.cart.push(equipmentAmount);
      this.availableAppointments = false;
    }
  }

  findMaxAmount(e:EquipmentAmount): number{
    const index = this.equipment.findIndex(item => item.equipment === e.equipment);
    if (index !== -1) {
      const maxAmount = this.equipment.at(index);
      //console.log(maxAmount?.quantity);
      return maxAmount!.quantity;
    }
    else {
      console.error("Can't find max amount for this company equipment!");
    }
    return 1;
  }
  
  onQuantityInput(e: any, maxAmount: number): void {
    const inputValue = parseInt(e.target.value, 10);
    if (inputValue > maxAmount) {
      e.target.value = maxAmount.toString();
    }
    const minAmount = 1;
    if (inputValue <= minAmount){
      e.target.value = minAmount.toString();
    }
  }

  RemoveFromCart(e:Equipment){
    const indexToRemove = this.cart.findIndex(item => item.equipment === e);
    if (indexToRemove !== -1) {
      this.cart.splice(indexToRemove, 1);
      this.availableAppointments = false;
    }
  }

  showAppointments(){
    this.availableAppointments = true;
    this.scrollToElement();
  }

  findCustomAppointments(){
    if(!this.selectedDate || !this.company){
      return;
    }
    this.companyService.getCustomAppointmentsOnDate(new Date(this.selectedDate), this.company.id).subscribe({
      next: (result)=>{
        this.appointments = result;
      },
      error: (err)=>{
        alert(err);
      }
    });
  }
  filter(){
    if(this.search==='' && this.company){
      this.equipment = this.company?.equipmentAmountInStock;
      return;
    }
    this.equipment = this.equipment.filter((eq) =>
    eq.equipment.name.toLowerCase().includes(this.search.toLowerCase()));
  }

  getCompany(): void {
    this.companyService.getCompany(this.companyId).subscribe(
      (data) => {
        this.company = data;
        this.equipment = this.company.equipmentAmountInStock;
        this.getCompanyAdmins(this.company);
        this.getAppointments();
        this.getReservations();
      },
      (error) => {
        console.error('Unable to load company. Try again later.');
      }
    );
  }

  getCompanyAdmins(company: Company): void{
    this.userService.getCompanyAdminsByCompany(company).subscribe(
      (data) => {
        this.admins = data;
        this.getUsers(this.admins);
        this.canCompanyAdminSee();
      },
      (error) => {
        console.error('Unable to load company administrators. Try again later.');
      }
    );
  }

  getUsers(admins: CompanyAdmin[]): void {
    admins.forEach(admin => {
      let user : User;
      this.userService.getUser(admin.id).subscribe(
        (data) => {
          user = data;
          //admin.user = user;
          //console.log(admin.user);
        },
        (error) => {
          console.error('Unable to load user. Try again later.');
        }
      );
    })
  }

  getAppointments(): void {
    if (this.company !== undefined){
      this.companyService.getByCompany(this.company).subscribe(
        (data) => {
          this.appointments = this.filterAppointments(data);
        },
        (error) => {
          console.error('Unable to load appointments.');
        }
      );
    } else {
      console.error('Unable to load appointments. Company isnt loaded.');
    }    
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
    if(this.user?.role==='COMPANY_ADMIN')
      return data.filter(reservation => (reservation.status === "PENDING"));
    else
      return data;
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
  
  // deleteCompanyProfile(): void {
  //   this.companyService.deleteCompany(this.companyId).subscribe();
  // }

  isReservationPickupPossible(r: Reservation): boolean{
    if (r.status === 'PENDING' && this.isFutureDate(r.pickUpAppointment.date)
    && this.user?.id === r.pickUpAppointment.companyAdmin.id) {
      return true;
    } else {
      return false;
    }
    return false;
  }

  isFutureDate(date: Date): boolean {
    const convertedDate = Array.isArray(date) ? this.convertToDate(date) : date;
    const currentDate = new Date();
    if (convertedDate! > currentDate){
      return true;
    }
    return false;
  }

  markAsPickedUp(r: Reservation): void{
    const isConfirmed = window.confirm('Are you sure you want to mark this reservation as picked up?');
    
    if (isConfirmed) {
      this.userService.markAsPicked(r.id, r).subscribe(
        (result: Reservation) => {
          console.log('You have marked reservation as picked up.');
          this.ngOnInit();
        },
        (error) => {
          console.error('Error picking up your reservation.');
        }
      );
    } else {
      console.log('Picking up of reservation canceled.');
    }
  }
}
