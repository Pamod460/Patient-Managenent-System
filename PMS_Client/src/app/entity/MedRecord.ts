import {Patient} from "./Patient";

export interface MedRecord {
  id?: number;
  patient?: Patient;
  record_date?: Date; // Use string for date to handle ISO format
  complaints?: string;
  history?: string;
  diagnosed?: string;
  treatment?: string;
  next_review?: Date; // Use string for date to handle ISO format
  charges?: number;
  first_image?:any
  second_image?:any
  [key: string]: any;
}
