import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import {ApiConfig} from "./shered/ApiConfig";
import {User} from "../entity/User";
import {Patient} from "../entity/Patient";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient,private router :Router) {
  }

  // URL to your Flask login endpoint

  login(username: string, password: string): Observable<boolean> {
    const url = ApiConfig.createURL('login');
    const hashedPassword = CryptoJS.SHA256(password).toString();
    return this.http.post<{ access_token: string, refresh_token: string, user: User }>(url, {
      username,
      password: hashedPassword
    }).pipe(
      map(result => {
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        this.setTokens(result.access_token, result.refresh_token)
        return true;
      })
    );
  }

  getCurrentUser(): any {
    // Retrieve current user from localStorage
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  refreshToken(): Observable<any> {
    const url = ApiConfig.createURL('refresh');
    const refreshToken = this.getRefreshToken();

    return this.http.post<{ access_token: string }>(url, { refresh_token: refreshToken }).pipe(
      map(response => {
        this.setAccessToken(response.access_token);
        return response;
      }),
      catchError(error => {
        if (error.status === 401) {
          this.logout();
        }
        return throwError(error);
      })
    );
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.setAccessToken(accessToken)
    localStorage.setItem('refresh_token', refreshToken);
  }
  setAccessToken(accessToken: string): void {
    localStorage.setItem('access_token', accessToken);
  }
  isAdmin(): boolean {
    // Check if current user is admin based on stored user information
    const user = this.getCurrentUser();
    return user && user.is_admin == 1;
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('access_token') !== null;
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

   canSignup() : Observable<boolean>{
    const url = ApiConfig.createURL('has_users')
    return   this.http.get<{ has_users: boolean }>(url).pipe( map(response => response.has_users));

  }

  signup(username: string, pw: string, confPw: string) {
    const password = CryptoJS.SHA256(pw).toString();
    const confirmPassword = CryptoJS.SHA256(confPw).toString();
    const url = ApiConfig.createURL('signup')
    return this.http.post<any>(url, {username, password, confirmPassword});
  }
}
