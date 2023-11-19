import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CompanyAdmin } from './model/company-admin.model';
import { Company } from '../companies/model/company.model';
import { User } from './model/user.model';
import { Employee } from './model/employee.model';

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
  getCurrentUser(): Observable<User>{
    return this.http.get<User>(`${this.apiUrl}/api/users/current-user` );
  } 	
  getCurrentEmployee(): Observable<Employee>{
    return this.http.get<Employee>(`${this.apiUrl}/api/users/current-employee` );
  } 	
  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/api/users`, user);
  }
  updateEmployee(user: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/api/users/employee`, user);
  }
  getUser(id: number): Observable<User>{
    return this.http.get<User>(`${this.apiUrl}/api/users/${id}`);
  }

  logout(): Observable<any> {
  localStorage.removeItem('sessionId');

  return this.http.post(`${this.apiUrl}/api/users/logout`, {}, { responseType: 'text' as 'json' }).pipe(
    tap(response => {
      console.log('Logout successful:', response);
    })
  );
}

  

  isAuthenticated(): boolean {
    return !!localStorage.getItem('sessionId');
  }

  saveUser(employee: any, password: string): Observable<any> {
    const params = { password };
    const options = { params: new HttpParams({ fromObject: params }) };

    return this.http.post(`${this.apiUrl}/api/users`, employee, options);
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
}
