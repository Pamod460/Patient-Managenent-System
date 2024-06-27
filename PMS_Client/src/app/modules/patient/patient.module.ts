import { NgModule } from '@angular/core';
import {CommonModule, DatePipe, NgOptimizedImage} from '@angular/common';
import { PatientComponent } from './patient.component';
import { PatientFormComponent } from './patient-form/patient-form.component';
import { PatientViewComponent } from './patient-view/patient-view.component';
import {PatientRoutingModule} from "./patient-routing.module";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatNativeDateModule} from "@angular/material/core";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatTableModule} from "@angular/material/table";
import { MatSnackBarModule} from "@angular/material/snack-bar";
import {WebcamModule} from "ngx-webcam";
import {ToastrModule} from "ngx-toastr";
import {MatCardModule} from "@angular/material/card";



@NgModule({
  providers: [DatePipe],
  declarations: [
    PatientComponent,
    PatientFormComponent,
    PatientViewComponent
  ],
    imports: [
        CommonModule,
        PatientRoutingModule,
        MatButtonModule,
        MatInputModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule,
        MatGridListModule,
        ReactiveFormsModule,
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
        WebcamModule,
        NgOptimizedImage,

        ToastrModule.forRoot(),
        MatCardModule

    ]
})
export class PatientModule { }
