import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8084/api/users';

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  postData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/your-endpoint`, data);
  }
}

