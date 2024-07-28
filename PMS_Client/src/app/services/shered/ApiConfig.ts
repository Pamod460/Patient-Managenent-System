import {environment} from "../../../environments/environment";

export class ApiConfig{
  //static readonly API_URL="https://sarathhemachandra.com/api"
  //  static readonly API_URL="http://127.0.0.1:5000"
  static readonly API_URL = environment.API_URL;
   // static readonly API_URL="http://localhost/PMS_Server"
  static createURL(query:String){
    return`${this.API_URL}/${query}`
  }
}
