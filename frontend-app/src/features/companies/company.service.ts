import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from './model/company.model';
import { CompanyAdmin } from '../users/model/company-admin.model';
import { PickUpAppointment } from './model/pickup-appointment.model';

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
  deleteCompany(id: number): Observable<Company> {
    return this.http.delete<Company>(`${this.apiUrl}/${id}`);
  }

  // PickUpAppointments
  private apiUrlAppointments = 'http://localhost:8084/api/appointments';

  getAllAppintments(): Observable<PickUpAppointment[]> {
    return this.http.get<PickUpAppointment[]>(`${this.apiUrlAppointments}/all`);
  }
  getAppointment(id: number): Observable<PickUpAppointment> {
    return this.http.get<PickUpAppointment>(`${this.apiUrlAppointments}/${id}`);
  }
  addAppointment(appointment: any): Observable<PickUpAppointment> {
    return this.http.post<PickUpAppointment>(`${this.apiUrlAppointments}`, appointment);
  }
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
}