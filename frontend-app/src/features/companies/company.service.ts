import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from './model/company.model';
import { CompanyAdmin } from '../users/model/company-admin.model';
import { PickUpAppointment } from './model/pickup-appointment.model';
import { Equipment } from './model/equipment.model';
//import { Reservation } from './model/reservation.model';
import { Reservation } from '../users/model/reservation';
import { Contract } from './model/contract.model';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private apiUrl = 'http://localhost:8084/api/companies';

  constructor(private http: HttpClient) {}

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.apiUrl}/all`);
  }
  getCompany(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/${id}`);
  }
  addCompany(company: Company):  Observable<Company> {
    return this.http.post<Company>(`${this.apiUrl}`, company);
  }
  updateCompany(company: Company): Observable<Company> {
    return this.http.put<Company>(`${this.apiUrl}`, company);
  }
  updateCompanyEquipment(company: Company): Observable<Company> {
    return this.http.post<Company>(`${this.apiUrl}/equipment-update`, company);
  }
  deleteCompany(id: number): Observable<Company> {
    return this.http.delete<Company>(`${this.apiUrl}/${id}`);
  }
  getEquipment(): Observable<Equipment[]>{
    return this.http.get<Equipment[]>(`http://localhost:8084/api/equipment/all`);
  }

  // PickUpAppointments
  private apiUrlAppointments = 'http://localhost:8084/api/appointments';

  getAllAppintments(): Observable<PickUpAppointment[]> {
    return this.http.get<PickUpAppointment[]>(`${this.apiUrlAppointments}/all`);
  }
  getAppointment(id: number): Observable<PickUpAppointment> {
    return this.http.get<PickUpAppointment>(`${this.apiUrlAppointments}/${id}`);
  }
  addAppointment(appointment: PickUpAppointment | any): Observable<PickUpAppointment> {
    return this.http.post<PickUpAppointment>(`${this.apiUrlAppointments}/addNew`, appointment);
  }
  getPickUpAppointmentsForCompanyAdmin(companyAdmin: CompanyAdmin): Observable<PickUpAppointment[]>{
    return this.http.post<PickUpAppointment[]>(`${this.apiUrlAppointments}/findByCompanyAdmin`, companyAdmin);
  }
  private apiUrlContracts = 'http://localhost:8084/api/contracts';
  getContracts(company: String):Observable<Contract[]>{
    return this.http.get<Contract[]>(`${this.apiUrlContracts}/${company}`);
  }
  cancelContract(contract: Contract): Observable<Contract>{
    return this.http.put<Contract>(`${this.apiUrlContracts}/cancel`, contract);
  }
  
  // addAppointment(appointment: any, date: any): Observable<any> {
  //   const params = { date };
  //   const options = { params: new HttpParams({ fromObject: params }) };
  //   return this.http.post(`${this.apiUrlAppointments}`, appointment, options);
  // }
  updateAppointment(appointment: PickUpAppointment): Observable<PickUpAppointment> {
    return this.http.put<PickUpAppointment>(`${this.apiUrlAppointments}`, appointment);
  }
  deleteAppointment(id: number): Observable<PickUpAppointment> {
    return this.http.delete<PickUpAppointment>(`${this.apiUrlAppointments}/${id}`);
  }
  getByCompanyAdmin(admin: CompanyAdmin): Observable<PickUpAppointment[]> {
    return this.http.post<PickUpAppointment[]>(`${this.apiUrlAppointments}/findByCompanyAdmin`, admin);
  }
  getByCompany(company: Company): Observable<PickUpAppointment[]> {
    return this.http.post<PickUpAppointment[]>(`${this.apiUrlAppointments}/findByCompany`, company);
  }
  getCustomAppointmentsOnDate(date:Date, companyId: number){
    return this.http.get<PickUpAppointment[]>(`${this.apiUrlAppointments}/custom/${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}/${companyId}`)
  }
  private apiUrlReservations = 'http://localhost:8084/api/reservations';

  getReservationsForCompanyAdmin(id: number): Observable<Reservation[]>{
    return this.http.get<Reservation[]>(`${this.apiUrlReservations}/findByCompanyAdmin/` + id);
  }
  getReservationsByCompany(id: number): Observable<Reservation[]>{
    return this.http.get<Reservation[]>(`${this.apiUrlReservations}/allByCompany/` + id);
  }
  markAsPicked(id: number, reservation: Reservation) : Observable<Reservation>{
    return this.http.put<Reservation>(`${this.apiUrlReservations}/markAsPicked/${id}`, reservation);
  } 
  markAsExpired(id: number) : Observable<Reservation>{
    return this.http.put<Reservation>(`${this.apiUrlReservations}/markAsExpired/${id}`, null);
  } 
}