import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CompanyAdmin } from './model/company-admin.model';
import { Company } from '../companies/model/company.model';
import { User } from './model/user.model';
import { Customer } from './model/customer.model';
import { Reservation } from './model/reservation';
import { CompanyComplaint } from './model/company-complaint.model';
import { CompanyAdminComplaint } from './model/company-admin-complaint';
import { SystemAdmin } from './model/system-admin.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private apiUrl = 'http://localhost:8084';

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<string> {
    return this.http.post(`${this.apiUrl}/api/users/login`, credentials, { responseType: 'text' }).pipe(
      tap((sessionId: string) => {
        localStorage.setItem('sessionId', sessionId);
      })
    );
  }

  logout(): Observable<any> {
    localStorage.removeItem('sessionId');
      return this.http.post(`${this.apiUrl}/api/users/logout`, {}, { responseType: 'text' as 'json' }).pipe(
        tap(response => {
          console.log('Logout successful:', response);
        })
        );
  }  

  changePassword(user: User, password: string): Observable<any> {
    const params = { password };
    const options = { params: new HttpParams({ fromObject: params }) };

    return this.http.put(`${this.apiUrl}/api/users/change-password`, user, options);
  }

  getCurrentUser(): Observable<User>{
    return this.http.get<User>(`${this.apiUrl}/api/users/current-user` );
  } 	
  getCurrentCustomer(): Observable<Customer>{
    return this.http.get<Customer>(`${this.apiUrl}/api/users/current-customer` );
  } 	
  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/api/users`, user);
  }
  updateCustomer(user: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/api/users/customer`, user);
  }
  getUser(id: number): Observable<User>{
    return this.http.get<User>(`${this.apiUrl}/api/users/${id}`);
  }
  getUsers(): Observable<User[]>{
    return this.http.get<User[]>(`${this.apiUrl}/api/users/all`);
  }
  saveCompanyAdmin(admin: CompanyAdmin, password: string): Observable<CompanyAdmin>{
    return this.http.post<CompanyAdmin>(`${this.apiUrl}/api/users/companyAdmins/`+ password, admin)
  }
  isAuthenticated(): boolean {
    return !!localStorage.getItem('sessionId');
  }

  saveUser(customer: any, password: string): Observable<any> {
    const params = { password };
    const options = { params: new HttpParams({ fromObject: params }) };

    return this.http.post(`${this.apiUrl}/api/users`, customer, options);
  }

  saveSystemAdmin(systemAdmin: any, password: string): Observable<any> {
    const params = { password };
    const options = { params: new HttpParams({ fromObject: params }) };

    return this.http.post(`${this.apiUrl}/api/users/saveSystemAdmin`, systemAdmin, options);
  }

  activateUser(token: string) {
    return this.http.get(`${this.apiUrl}/api/users/activate/${token}`, { responseType: 'text' });
  }

  //  CompanyAdmins 
  //  api/users/companyAdmins
  getCompanyAdmins(): Observable<CompanyAdmin[]> {
    return this.http.get<CompanyAdmin[]>(`${this.apiUrl}/api/users/companyAdmins/all`);
  }
  getCompanyAdmin(id: number): Observable<CompanyAdmin> {
    return this.http.get<CompanyAdmin>(`${this.apiUrl}/api/users/companyAdmins/${id}`);
  }
  getCurrentCompanyAdmin(): Observable<CompanyAdmin>{
    return this.http.get<CompanyAdmin>(`${this.apiUrl}/api/users/current-companyAdmin`);
  }
  getCompanyAdminsByCompany(company: Company): Observable<CompanyAdmin[]> {
    return this.http.post<CompanyAdmin[]>(`${this.apiUrl}/api/users/companyAdmins/findByCompany`, company);
  }
  // addCompanyAdmin(company: CompanyAdmin):  Observable<CompanyAdmin> {
  //   return this.http.post<CompanyAdmin>(`${this.apiUrl}/api/users/companyAdmins`, company);
  // }
  updateCompanyAdmin(companyAdmin: CompanyAdmin): Observable<CompanyAdmin> {
    return this.http.put<CompanyAdmin>(`${this.apiUrl}/api/users/companyAdmins`, companyAdmin);
  }
  // deleteCompanyAdmin(id: number): Observable<CompanyAdmin> {
  //   return this.http.delete<CompanyAdmin>(`${this.apiUrl}/api/users/companyAdmins/${id}`);
  // }

  getCustomersReservations(id: number): Observable<Reservation[]>{
    return this.http.get<Reservation[]>(`${this.apiUrl}/api/reservations/allByCustomer/${id}`);
  }
  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/api/customers/${id}`);
  }

  makeReservation(reservation: Reservation) {
    return this.http.post<Reservation>(`${this.apiUrl}/api/reservations`, reservation);
  }
  
  getAllCompanyComplaints() : Observable<CompanyComplaint[]> {
    return this.http.get<CompanyComplaint[]>(`${this.apiUrl}/api/complaints/allCompanyComplaints`);
  }

  getAllCompanyAdminComplaints() : Observable<CompanyAdminComplaint[]> {
    return this.http.get<CompanyAdminComplaint[]>(`${this.apiUrl}/api/complaints/allCompanyAdminComplaints`);
  }
}
