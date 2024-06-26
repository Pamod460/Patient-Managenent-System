import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ApiConfig} from "./shered/ApiConfig";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {}

  getPatientsPerDay(): Observable<any[]> {
    const url=ApiConfig.createURL('get_chart_data')
    return this.http.get<any[]>(url);
  }
}
