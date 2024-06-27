import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import {UserRoutingModule} from "./user-routing.module";
import { UserFormComponent } from './user-form/user-form.component';
import { UserViewComponent } from './user-view/user-view.component';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule, MatOptionModule} from "@angular/material/core";
import {WebcamModule} from "ngx-webcam";
import {MatSelectModule} from "@angular/material/select";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatCardModule} from "@angular/material/card";



@NgModule({
  declarations: [
    UserComponent,
    UserFormComponent,
    UserViewComponent
  ],
    imports: [
        CommonModule,
        UserRoutingModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatInputModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatOptionModule,
        WebcamModule,
        MatSelectModule,
        MatSnackBarModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule,
        MatGridListModule,
        MatTableModule,
        MatSnackBarModule,
        MatCardModule,
    ]
})
export class UserModule { }
