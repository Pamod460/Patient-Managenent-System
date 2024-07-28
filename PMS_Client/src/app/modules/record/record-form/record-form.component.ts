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
import {DialogComponent} from "../../../utils/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import formatters from "chart.js/dist/core/core.ticks";


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
  isNew: any;
  private newRecord: MedRecord={};

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private patientService: PatientService,
    private _snackBar: MatSnackBar,
    private toastr: ToastrService,
    private recordService: RecordService,
    private dialog: MatDialog
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
    this.route.url.subscribe(val => {
      if (val[0].path == 'new') {
        this.isNew = true
      } else if (val[0].path == 'modify') {
        this.isNew = false
      }
    })
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
        console.log('modify')
        this.oldRecord = await this.recordService.getRecordById(value[1].path)
        this.oldRecord=this.oldRecord['records']
        if (this.oldRecord.patient){
          this.patient = this.oldRecord.patient;

        }
       this.fillForm(this.oldRecord)

      } else if (value[0].path == "new") {
        this.route.paramMap.subscribe(async params => {
          if (params.get('id')!=null){
            this.patient = await this.patientService.getPatientById(params.get('id'));
            this.patient=this.patient['patient']
            this.setId(this.patient)
            let today=new Date()
            this.setDate('record_date',today)

          }

        });
      }
    })
  }

  fillForm(oldRecord: MedRecord){
    console.log(oldRecord.patient?.id)
    this.recordForm.controls['patient_id'].setValue(oldRecord.patient?.id)
    this.recordForm.controls['record_date'].setValue(oldRecord.record_date)
    this.recordForm.controls['complaints'].setValue(oldRecord.complaints)
    this.recordForm.controls['history'].setValue(oldRecord.history)
    this.recordForm.controls['diagnosed'].setValue(oldRecord.diagnosed)
    this.recordForm.controls['treatment'].setValue(oldRecord.treatment)
    this.recordForm.controls['charges'].setValue(oldRecord.charges)
    this.recordForm.controls['next_review'].setValue(oldRecord.next_review)
    this.recordForm.controls['photo'].setValue(oldRecord.first_image)
    this.serverImageData=oldRecord.first_image
    // this.recordForm.patchValue({
    //   patient_id: oldRecord.patient?.id || '',
    //   record_date: oldRecord.record_date || '',
    //   complaints: oldRecord.complaints || '',
    //   history: oldRecord.history || '',
    //   diagnosed: oldRecord.diagnosed || '',
    //   treatment: oldRecord.treatment || '',
    //   charges: oldRecord.charges || '',
    //   next_review: oldRecord.next_review || '',
    //   photo: oldRecord.patient?.photo || ''
    // });
}
  setId(patient: Patient) {
    console.log(patient)
    this.recordForm.controls['patient_id'].setValue(patient.id)
  }
setDate(control:any,date:Date){
  this.recordForm.controls[control].setValue(date)
  console.log(control,date)
}
  compareBase64Images(base64Image1: string, base64Image2: string): boolean {
    let same= false
    if (base64Image1!='' && base64Image2!=''){
      const base64WithoutHeader = (base64: string) =>{
        if (base64)
       return  base64.split(',')[1]
        else return []
      };

      same= base64WithoutHeader(base64Image1) === base64WithoutHeader(base64Image2);
    }
    return same
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

  update() {
    console.log(this.serverImageData == this.recordForm.controls['photo'].value)
    if (this.recordForm.pristine && this.serverImageData == this.recordForm.controls['photo'].value) {
      this._snackBar.open("Nothing to be update", '', {
        duration: 2000,
        horizontalPosition: "right",
        verticalPosition: "top"
      })
    } else {
      let controlNames = Object.keys(this.recordForm.controls);
      let msg = "You have Following Updates:"
      let changes: any[] = []

      controlNames.forEach(val => {
        console.log(`Checking control: ${val}`);
        console.log(`Current value: ${this.recordForm.controls[val].value}`);
        let hasValueChanged = this.recordForm.controls[val].value !== (val === 'patient_id' ? this.oldRecord.patient?.id : this.oldRecord[val]);
        let isImageEqual = val === 'photo' && this.compareBase64Images(this.recordForm.controls[val].value, this.oldRecord['first_image']);

        if (hasValueChanged && !isImageEqual) {
          this.newRecord[val] = this.recordForm.controls[val].value;

          if (val !== "birthday") {
            changes.push({key: val, value: this.recordForm.controls[val].value});
            console.log(`Added change for ${val}: ${this.recordForm.controls[val].value}`);
          }
        }
      });

      console.log(`Final changes: ${JSON.stringify(changes)}`);
      const dialogRef = this.dialog.open(DialogComponent, {

        data: {title: 'Update Patient', message: msg, changes: changes}

      })
      dialogRef.afterClosed().subscribe(async result => {
        if (result) {
          this.recordService.modify(this.oldRecord?.id, this.newRecord).then(res => {
            console.log(res)

            // @ts-ignore
            this.toastr.success(res['status'])
          })

        }
      })
    }
  }
  resetCamera(): void {
    this.webcamImage = null;
  }
}
