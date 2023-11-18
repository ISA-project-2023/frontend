import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CompanyAdmin } from './model/company-admin.model';
import { User } from './model/user.model';

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
  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/api/users`, user);
  }

  // getUser(id: number): Observable<User>{
  //   return this.http.get<User>(`${this.apiUrl}/api/users/${id}`);
  // } 	

  logout(): Observable<string> {
    localStorage.removeItem('sessionId');

    return this.http.post<string>(`${this.apiUrl}/api/users/logout`, {}).pipe(
      tap(() => {
        
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


  //  CompanyAdmins 
  //  api/users/companyAdmins
  getCompanyAdmins(): Observable<CompanyAdmin[]> {
    return  this.http.get<CompanyAdmin[]>(`${this.apiUrl}/api/users/companyAdmins/all`);
  }
  getCompanyAdmin(id: number): Observable<CompanyAdmin> {
    return this.http.get<CompanyAdmin>(`${this.apiUrl}/api/users/companyAdmins/${id}`);
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
  getCompanyAdminsByCompany(companyId: number): Observable<CompanyAdmin> {
    return this.http.get<CompanyAdmin>(`${this.apiUrl}/api/users/companyAdmins/findByCompany/${companyId}`);
  }
}
