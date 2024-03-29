import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { enviroment } from '../../enviroments/enviroment';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient)
  sessionService = inject(SessionService)
  apiUrl = enviroment.API_URL
  user$ = new BehaviorSubject(null)

  constructor() { }

  login(email: string, pass: string){
    return this.http.post(`${this.apiUrl}api/v1/auth/login`, {
      email,
      pass
    }).pipe(
      tap(response => {
        this.sessionService.saveToken('prueba123')
        this.sessionService.saveRefreshToken('prueba123')
      })
    );
  }

  refreshToken(refreshToken: string) {
    return this.http.post(`${this.apiUrl}/api/v1/auth/refresh-token`, {refreshToken})
    .pipe(
      tap(response => {
        this.sessionService.saveToken('prueba123');
        this.sessionService.saveRefreshToken('prueba123');
      })
    );
  }

  register(email: string, name: string, password: string){
    return this.http.post(`${this.apiUrl}api/v1/auth/register`, {
      email,
      password,
      name
    });
  }

  registerAndLogin(email: string, name: string, password: string) {
    return this.register(email, name, password)
    .pipe(
      switchMap(() => this.login(email, password))
    );
  }

  isAvailable(email: string){
    return this.http.post(`${this.apiUrl}api/v1/auth/is-available`, {
      email
    });
  }

  recovery(email: string){
    return this.http.post(`${this.apiUrl}api/v1/auth/recovery`, {
      email
    });
  }

  profile(token: string){
    return this.http.get(`${this.apiUrl}api/v1/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      tap((response:any) => {
        this.user$.next(response)
      })
    )
  }

  changePassword(token: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}api/v1/auth/change-password`, { token, newPassword });
  }

  logout(){
    this.sessionService.removeToken()
  }
}
