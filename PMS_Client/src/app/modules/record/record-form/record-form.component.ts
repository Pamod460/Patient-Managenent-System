import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {WebcamImage, WebcamInitError, WebcamUtil} from "ngx-webcam";
import {Observable, Subject} from "rxjs";
import {Patient} from "../../../entity/Patient";
import {PatientService} from "../../../services/patient.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ToastrService} from "ngx-toastr";
import {MedRecord} from "../../../entity/MedRecord";
import {RecordService} from "../../../services/record.service";

@Component({
  selector: 'app-record-form',
  templateUrl: './record-form.component.html',
  styleUrls: ['./record-form.component.scss']
})
export class RecordFormComponent implements OnInit {
  patient: Patient = {};
  recordForm: FormGroup;
  serverImageData?: string;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();

  // latest snapshot
  webcamImage: WebcamImage | null = null;
  public availableDevices: MediaDeviceInfo[] = [];
  // webcam switch control
  public showWebcam = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string = '';
  public errors: WebcamInitError[] = [];
  private record: MedRecord = {};
  private oldRecord: MedRecord = {}

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private patientService: PatientService,
    private _snackBar: MatSnackBar,
    private toastr: ToastrService,
    private recordService: RecordService
  ) {


    this.recordForm = this.fb.group({
      patient_id: [''],
      record_date: ['', Validators.required],
      complaints: ['',],
      history: ['',],
      diagnosed: ['',],
      treatment: ['',],
      charges: [''],
      next_review: [''],
      photo: ['']
    });

  }

  public handleImage(webcamImage: WebcamImage): void {
    // this.recordForm.controls['photo'].setValue(webcamImage.imageAsDataUrl)
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    this.deviceId = deviceId;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs().then((mediaDevices: MediaDeviceInfo[]) => {
      this.availableDevices = mediaDevices;
      this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    });


    this.loadForm()
  }

  loadForm() {
    this.route.url.subscribe(async value => {
      if (value[0].path == "modify") {
        this.oldRecord = await this.recordService.getRecordById(value[1].path)
        this.patient = await this.patientService.getPatientById(this.oldRecord['patient_id']);
       this.fillForm( this.oldRecord)

      } else if (value[0].path == "new") {
        this.route.paramMap.subscribe(async params => {
          this.patient = await this.patientService.getPatientById(params.get('id'));
          this.setId(this.patient)
        });
      }
    })
  }

  fillForm(oldRecord: MedRecord){
    this.recordForm.patchValue({
      patient_id: oldRecord['patient_id'],
      record_date: oldRecord.record_date,
      complaints: oldRecord.complaints,
      history: oldRecord.history,
      diagnosed: oldRecord.diagnosed,
      treatment: oldRecord.treatment,
      charges: oldRecord.charges,
      next_review: oldRecord.next_review,
      photo: oldRecord['photo']
    });
}
  setId(patient: Patient) {
    this.recordForm.controls['patient_id'].setValue(patient.id)
  }

  async addRecord(): Promise<void> {
    if (this.recordForm.valid) {
      this.record = this.recordForm.value;
      // Save newRecord logic here, e.g., call a service to save the data
      let re = await this.recordService.save(this.record)
      console.log('New Record:', this.record);
      this.toastr.success('Record added successfully');
    } else {
      this._snackBar.open('Please fill out all required fields', '', {
        horizontalPosition: "center",
        verticalPosition: "top",
        duration: 2000,
      });
    }
  }

  resetCamera(): void {
    this.webcamImage = null;
  }
}
