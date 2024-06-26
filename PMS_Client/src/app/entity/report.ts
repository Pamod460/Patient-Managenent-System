import {MedRecord} from "./MedRecord";

export interface Report{
  records?:MedRecord
  total?:number
  [key: string]: any;
}
export { MedRecord };

