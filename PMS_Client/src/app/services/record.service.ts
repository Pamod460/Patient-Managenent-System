import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { MedRecord } from '../entity/MedRecord';
import {ApiConfig} from "./shered/ApiConfig";


@Injectable({
  providedIn: 'root'
})
export class RecordService {
  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  private async handle401Error<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error: any) {
      if (error.status === 401) {
        try {
          await this.authService.refreshToken().toPromise();
          return await operation();
        } catch (err) {
          this.authService.logout();
          this.router.navigate(['/login']);
          throw err;
        }
      } else {
        throw error;
      }
    }
  }

  async getAllRecords(): Promise<MedRecord[]> {
    const url = ApiConfig.createURL('records');
    // @ts-ignore
    return this.handle401Error(() => this.http.get<MedRecord[]>(url).toPromise());
  }

  async getRecordById(id: string | null): Promise<MedRecord> {
    const url = ApiConfig.createURL(`records/${id}`);
    // @ts-ignore
    return this.handle401Error(() => this.http.get<MedRecord>(url).toPromise());
  }

  async save(record: MedRecord): Promise<any> {
    const url = ApiConfig.createURL('records');
    return this.handle401Error(() => this.http.post<any[]>(url, record).toPromise());
  }

  async remove(id: number | undefined): Promise<any> {
    const url = ApiConfig.createURL(`records/${id}`);
    return this.handle401Error(() => this.http.delete<any[]>(url).toPromise());
  }

  async modify(id: number | undefined, newRecord: MedRecord | undefined): Promise<any[]> {
    const url = ApiConfig.createURL(`records/${id}`);
    // @ts-ignore
    return this.handle401Error(() => this.http.put<any[]>(url, newRecord).toPromise());
  }

  async getRecordByPatientId(id: string | null):Promise<MedRecord[]> {
    const url = ApiConfig.createURL(`records?patientId=${id}`);
    // @ts-ignore
    return this.handle401Error(() => this.http.get<MedRecord>(url).toPromise());
  }
}
