import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Patient} from "../../../entity/Patient";
import {MatSnackBar} from "@angular/material/snack-bar";
import {WebcamImage, WebcamInitError, WebcamUtil} from "ngx-webcam";
import {Observable, Subject} from "rxjs";
import {PatientService} from "../../../services/patient.service";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../../../utils/dialog/dialog.component";

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss']
})
export class PatientFormComponent implements OnInit {
  patientForm: FormGroup;
  phoneValidationMessage: string | undefined;
  serverImageData?: string;
  public availableDevices: MediaDeviceInfo[] = [];
  private initialDate: Date | undefined;
  private oldPatient: Patient = {};
  private newPatient: Patient = {};
  private patient: Patient = {};
// webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();

  // latest snapshot
  public webcamImage: WebcamImage | null = null;

  // webcam switch control
  public showWebcam = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string = '';

  public errors: WebcamInitError[] = [];

  public videoOptions: MediaTrackConstraints = {};
  isNew: boolean = true

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private fb: FormBuilder, private _snackBar: MatSnackBar, private patientService: PatientService, private toastr: ToastrService) {
    this.route.url.subscribe(val => {
      if (val[0].path == 'new') {
        this.isNew = true
      } else if (val[0].path == 'modify') {
        this.isNew = false
      }
    })

    this.patientForm = this.fb.group({
      name: ['', Validators.required],
      birthday: ['', Validators.required],
      age: [''],
      gender: ['', Validators.required],
      contact: ['', [Validators.required, Validators.pattern("^(?:0|94|\\+94)?(7[0-9]{8})$")]],
      photo: ['']
    });

    WebcamUtil.getAvailableVideoInputs().then((mediaDevices: MediaDeviceInfo[]) => {
      this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    });
    this.patientForm.controls['birthday'].valueChanges.subscribe(val => {
      this.setAge(val)
    });
  }


  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.patientForm.controls['photo'].setValue(webcamImage.imageAsDataUrl)
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {

    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs().then((mediaDevices: MediaDeviceInfo[]) => {
      this.availableDevices = mediaDevices;
      this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    });
    if (!this.isNew) {
      this.route.paramMap.subscribe(async params => {
        this.oldPatient = await this.patientService.getPatientById(params.get('id'))
        this.oldPatient = this.oldPatient['patient']
        this.fillForm(this.oldPatient)
      });
    }
  }

  fillForm(patient: Patient) {
    this.patientForm.controls['name'].setValue(patient.name)
    // @ts-ignore
    let dt = new Date(patient.birthday)
    this.patientForm.patchValue({
      birthday: dt
    });
    this.patientForm.controls['age'].setValue(patient.age)
    this.patientForm.controls['gender'].setValue(patient.gender)
    this.patientForm.controls['contact'].setValue(patient.contact)
    this.serverImageData = patient.photo
    this.patientForm.controls['photo'].setValue(this.serverImageData)

  }

  decodeBase64ToUtf8(base64String: string): string {
    const byteCharacters = atob(base64String);
    const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(byteArray);
  }

  setAge(birthDay: Date) {

    if (birthDay) {
      const today = new Date();
      const birthDate = new Date(birthDay);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      this.patientForm.patchValue({
        age: age
      });
    }

  }

  async add() {
    console.log(this.patientForm.valid)
    if (this.patientForm.valid) {
      let currentDate = new Date();
      this.patient.name = this.patientForm.controls['name'].value
      this.patient.age = this.patientForm.controls['age'].value
      this.patient.birthday = this.patientForm.controls['birthday'].value
      this.patient.gender = this.patientForm.controls['gender'].value
      this.patient.photo = this.patientForm.controls['photo'].value
      this.patient.contact = this.patientForm.controls['contact'].value
      this.patient.registered_date = currentDate
      let controlNames = Object.keys(this.patientForm.controls);
      let changes: any[] = []
      let msg = "you have following data to save :"
      controlNames.forEach(val => {
        changes.push({key: val, value: this.patientForm.controls[val].value})
      })
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {title: 'Update Patient', message: msg, changes: changes}
      })
      dialogRef.afterClosed().subscribe(async res => {
        if (res) {
          let result = await this.patientService.save(this.patient)
          if (result) {
            // @ts-ignore
            this.toastr.success(result['status'], 'success')
            this.patientForm.reset()
          }
        }
      })
    } else {
      this._snackBar.open('Please fill out all required fields', '', {
        horizontalPosition: "center",
        verticalPosition: "top",
        duration: 2000,

      })

    }
  }

  compareBase64Images(base64Image1: string, base64Image2: string): boolean {
    // Strip the base64 header for comparison
    const base64WithoutHeader = (base64: string) => base64.split(',')[1];

    return base64WithoutHeader(base64Image1) === base64WithoutHeader(base64Image2);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  update() {

    if (this.patientForm.pristine && this.serverImageData == this.patientForm.controls['photo'].value) {
      this._snackBar.open("Nothing to be update", '', {
        duration: 2000,
        horizontalPosition: "right",
        verticalPosition: "top"
      })
    } else {
      console.log(this.patientForm.valid)
      if (this.patientForm.valid) {
        let controlNames = Object.keys(this.patientForm.controls);
        let msg = "You have Following Updates:"
        let changes: any[] = []

        controlNames.forEach(val => {
          // console.log(val, this.patientForm.controls[val].value !== this.oldPatient?.[val])
          let isImageEqual
          let isBirthdayEqual
          if (val == 'photo') {
            isImageEqual = this.compareBase64Images(this.patientForm.controls[val].value, this.oldPatient?.[val])
          }
          if (val == "birthday") {

            let newbd = new Date(this.patientForm.controls[val].value)
            // @ts-ignore
            let oldbd = new Date(this.oldPatient[val])
            isBirthdayEqual = newbd.getTime() == oldbd.getTime()
          }
          if (this.patientForm.controls[val].value !== this.oldPatient?.[val] && !isImageEqual && !isBirthdayEqual) {
            this.newPatient[val] = this.patientForm.controls[val].value
            if (val != "birthday") {
              changes.push({key: val, value: this.patientForm.controls[val].value})
              console.log("changes", changes)
            } else {
              changes.push({key: val, value: this.formatDate(this.patientForm.controls[val].value)})
              console.log("changes", changes)
            }
          }
        })
        const dialogRef = this.dialog.open(DialogComponent, {
          data: {title: 'Update Patient', message: msg, changes: changes}
        })
        dialogRef.afterClosed().subscribe(async result => {
          if (result) {
            this.patientService.modify(this.oldPatient?.id, this.newPatient).then(res => {
              // @ts-ignore
              this.toastr.success(res['status'])
              this.patientForm.reset()
              this.serverImageData = ''
            })
          }
        })
      } else {
        this.toastr.error("contact number is incorrect")
      }
    }
  }

  resetCamera() {
    this.webcamImage = null
  }
}
