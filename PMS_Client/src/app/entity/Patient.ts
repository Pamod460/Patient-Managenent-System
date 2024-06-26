export interface Patient {
  age?: number;
  birthday?: Date;
  contact?: string;
  gender?: string;
  id?: number;
  name?: string;
  photo?: any;
  registered_date?: Date;
  [key: string]: any;

}
