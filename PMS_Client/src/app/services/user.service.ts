import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../entity/User";
import {ApiConfig} from "./shered/ApiConfig";

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http: HttpClient) {
  }

  async getAllUsers(): Promise<User[]> {
    const url = ApiConfig.createURL("users")
    // @ts-ignore
    return this.http.get<User[]>(url).toPromise();
  }
  async getAllUsersById(id: string | null): Promise<User> {
    const url = ApiConfig.createURL("users/"+id)
    // @ts-ignore
    return this.http.get<User>(url).toPromise();
  }
  async save(user:User){
    const url = ApiConfig.createURL("users")

    return this.http.post<any[]>(url,user).toPromise()
  }

  async remove(id: number | undefined) {
    const url = ApiConfig.createURL("users/"+id)

    return this.http.delete<any[]>(url).toPromise()
  }


  async modify(id: number | undefined, newUser: User | undefined) {
    const url = ApiConfig.createURL("users/"+id)

    return this.http.put<any[]>(url,newUser).toPromise()
  }
}
