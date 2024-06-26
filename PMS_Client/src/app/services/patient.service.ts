import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Patient } from '../entity/Patient';
import { catchError, switchMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import {ApiConfig} from "./shered/ApiConfig";


@Injectable({
  providedIn: 'root'
})
export class PatientService {
  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  private handle401Error<T>(operation: () => Observable<T>): Observable<T> {
    return operation().pipe(
      catchError(error => {
        if (error.status === 401) {
          return this.authService.refreshToken().pipe(
            switchMap(operation),
            catchError(err => {
              this.authService.logout();
              this.router.navigate(['/login']);
              return throwError(err);
            })
          );
        } else {
          return throwError(error);
        }
      })
    );
  }

  getAllPatients(): Observable<Patient[]> {
    const url = ApiConfig.createURL('patients');
    return this.handle401Error(() => this.http.get<Patient[]>(url));
  }

  getPatientById(id: string | null): Observable<Patient> {
    const url = ApiConfig.createURL(`patients/${id}`);
    return this.handle401Error(() => this.http.get<Patient>(url));
  }

  save(patient: Patient): Observable<any> {
    const url = ApiConfig.createURL('patients');
    return this.handle401Error(() => this.http.post<any[]>(url, patient));
  }

  remove(id: number | undefined): Observable<any> {
    const url = ApiConfig.createURL(`patients/${id}`);
    return this.handle401Error(() => this.http.delete<any[]>(url));
  }

  modify(id: number | undefined, newPatient: Patient | undefined): Observable<any> {
    const url = ApiConfig.createURL(`patients/${id}`);
    return this.handle401Error(() => this.http.put<any[]>(url, newPatient));
  }
}
