import {Component, Input} from '@angular/core';
import {PatientService} from "../../../services/patient.service";
import {Patient} from "../../../entity/Patient";
import {ActivatedRoute} from "@angular/router";
import {MedRecord} from "../../../entity/MedRecord";
import {RecordService} from "../../../services/record.service";

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.scss']
})
export class PatientProfileComponent {

   patient: Patient={};
  medicalRecords: MedRecord[]=[]
  // medicalRecord: MedRecord={}
  constructor(private patientService:PatientService,private route: ActivatedRoute,private recordService:RecordService) {

     this.route.paramMap.subscribe(async params => {
       this.patient = await this.patientService.getPatientById(params.get('id'))
       this.medicalRecords = await this.recordService.getRecordByPatientId(params.get('id'))
       // @ts-ignore
       this.medicalRecords =this.medicalRecords['records']
       this.patient=this.patient['patient']
     });


   }


}
