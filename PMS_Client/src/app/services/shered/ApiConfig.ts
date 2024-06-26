export class ApiConfig{
  //static readonly API_URL="https://sarathhemachandra.com/api"
   static readonly API_URL="http://127.0.0.1:5000"
  static createURL(query:String){
    return`${this.API_URL}/${query}`
  }
}
