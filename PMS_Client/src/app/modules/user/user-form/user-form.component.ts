import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../entity/User";
import {Observable, Subject} from "rxjs";
import {WebcamImage, WebcamInitError, WebcamUtil} from "ngx-webcam";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../../../services/user.service";
import {ToastrService} from "ngx-toastr";
import {DialogComponent} from "../../../utils/dialog/dialog.component";

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent {
  userForm: FormGroup;
  phoneValidationMessage: string | undefined;
  serverImageData?: string;
  public availableDevices: MediaDeviceInfo[] = [];
  private initialDate: Date | undefined;
  private oldUser: User = {};
  private newUser: User = {};
  private user: User = {};
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

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private fb: FormBuilder, private _snackBar: MatSnackBar, private userService: UserService, private toastr: ToastrService) {
    this.route.url.subscribe(val => {
      if (val[0].path == 'new') {
        this.isNew = true
      } else if (val[0].path == 'modify') {
        this.isNew = false
      }
    })

    this.userForm = this.fb.group({
      name: ['', Validators.required],
      birthday: ['', Validators.required],
      age: [''],
      gender: ['', Validators.required],
      contact: ['', Validators.required],
      photo: ['']
    });

    WebcamUtil.getAvailableVideoInputs().then((mediaDevices: MediaDeviceInfo[]) => {
      this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    });
    this.userForm.controls['birthday'].valueChanges.subscribe(val => {
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
    this.userForm.controls['photo'].setValue(webcamImage.imageAsDataUrl)
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
        this.oldUser = await this.userService.getAllUsersById(params.get('id'))
        this.fillForm(this.oldUser)
      });
    }
  }

  fillForm(user: User) {
    this.userForm.controls['name'].setValue(user.usename)
    // @ts-ignore
    let dt = new Date(user.birthday)
    this.userForm.patchValue({
      birthday: dt
    });


    this.serverImageData = this.decodeBase64ToUtf8(user.photo)
    this.userForm.controls['photo'].setValue(this.serverImageData)
    console.log(this.serverImageData == this.userForm.controls['photo'].value)
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
      this.userForm.patchValue({
        age: age
      });
    }

  }

  async add() {

    if (this.userForm.valid) {
      let currentDate = new Date();
      this.user.usename = this.userForm.controls['name'].value
      this.user.gender = this.userForm.controls['gender'].value
      this.user.photo = this.userForm.controls['photo'].value
      this.user.contact = this.userForm.controls['contact'].value
      this.user.is_admin=this.userForm.controls['is_admin'].value
      this.user.registered_date = currentDate
      let result = await this.userService.save(this.user)
      if (result) {
        // @ts-ignore
        this.toastr.success(result['message'])
      }

    } else {
      this._snackBar.open('Please fill out all required fields', '', {
        horizontalPosition: "center",
        verticalPosition: "top",
        duration: 2000,

      })

    }
  }

  update() {
    if (this.userForm.pristine && this.serverImageData == this.userForm.controls['photo'].value) {
      this._snackBar.open("Nothing to be update", '', {
        duration: 2000,
        horizontalPosition: "right",
        verticalPosition: "top"
      })
    } else {
      let controlNames = Object.keys(this.userForm.controls);
      let msg = "You have Following Updates:"
      let changes: any[] = []

      controlNames.forEach(val => {

        if (this.userForm.controls[val].value != this.oldUser?.[val]) {

          this.newUser[val] = this.userForm.controls[val].value
          if (val != "birthday") {
            changes.push({key: val, value: this.userForm.controls[val].value})
          }
        }
      })
      const dialogRef = this.dialog.open(DialogComponent, {

        data: {title: 'Update User', message: msg, changes: changes}

      })
      dialogRef.afterClosed().subscribe(async result => {
        if (result) {
          let res = await this.userService.modify(this.oldUser?.id, this.newUser)
          console.log(res)
        }
      })
    }
  }

  resetCamera() {
    this.webcamImage=null
  }
}
