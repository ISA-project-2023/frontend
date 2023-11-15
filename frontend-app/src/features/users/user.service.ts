import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
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
    return this.http.get<User>(`${this.apiUrl}/current-user` );
  } 	

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
}
