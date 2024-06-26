export interface User {
  id?: number
  usename?: string
  password?:string
  gender?:string
  is_admin?:boolean
  photo?:any
  registered_date?:Date
  contact?:string
  [key: string]: any;
}
