import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { RecordComponent } from './record.component';
import { RecordViewComponent } from './record-view/record-view.component';
import { RecordFormComponent } from './record-form/record-form.component';
import {RecordRoutingModule} from "./record-routing.module";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {MatNativeDateModule} from "@angular/material/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatTableModule} from "@angular/material/table";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {WebcamModule} from "ngx-webcam";
import {MatCardModule} from "@angular/material/card";



@NgModule({
  declarations: [
    RecordComponent,
    RecordViewComponent,
    RecordFormComponent
  ],
    imports: [
        CommonModule,
        RecordRoutingModule,
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
        MatCardModule,
    ]
})
export class RecordModule { }
