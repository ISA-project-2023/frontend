import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from './model/company.model';

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
}