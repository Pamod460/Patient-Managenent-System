import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../entity/User";
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
  passwordValidationMessage: string | undefined;
  private oldUser: User = {};
  private newUser: User = {};
  private user: User = {};


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
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/)]],
      confirmpassword: ['', [Validators.required, Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/)]],
    }, { validators: this.passwordMatchValidator });

  }

  get passwordFormField() {
    return this.userForm.get('password');
  }

  ngOnInit(): void {

    if (!this.isNew) {
      this.route.paramMap.subscribe(async params => {
        this.oldUser = await this.userService.getAllUsersById(params.get('id'))
        this.fillForm(this.oldUser)
      });
    }
  }

  fillForm(user: User) {
    this.userForm.controls['username'].setValue(user.username)
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    return form.get('password')?.value === form.get('confirmpassword')?.value ? null : { 'passwordMismatch': true };
  }
  async add() {
    console.log(this.userForm.get('password'),this.userForm.controls["confirmpassword"])
    console.log(this.passwordMatchValidator(this.userForm))
    if (this.userForm.valid && !this.userForm.errors?.['passwordMismatch']) {

      this.user.username = this.userForm.controls['username'].value
      this.user.password = this.userForm.controls['password'].value

      let result = await this.userService.save(this.user)
      if (result) {
        // @ts-ignore
        this.toastr.success(result['message'])

      }
    } else {
      if (this.userForm.errors?.['passwordMismatch']) {
        this.toastr.warning("password dos not match")
      } else {
        this._snackBar.open('Please fill out all required fields', '', {
          horizontalPosition: "center",
          verticalPosition: "top",
          duration: 2000,

        })
      }


    }
  }

  update() {
    if (this.userForm.pristine) {
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
        }
      })
      const dialogRef = this.dialog.open(DialogComponent, {

        data: {title: 'Update User', message: msg, changes: changes}

      })
      dialogRef.afterClosed().subscribe(async result => {
        if (result) {
          this.userService.modify(this.oldUser?.id, this.newUser).then(res => {
            console.log(res)

          })
        }
      })
    }
  }


}
