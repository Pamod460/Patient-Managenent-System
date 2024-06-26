import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Patient} from "../entity/Patient";
import {ApiConfig} from "./shered/ApiConfig";

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) {
  }

  async getDailyReport(): Promise<Report> {
    const url = ApiConfig.createURL("daily_report")
    // @ts-ignore
    return this.http.get<Report>(url).toPromise();
  }
}
