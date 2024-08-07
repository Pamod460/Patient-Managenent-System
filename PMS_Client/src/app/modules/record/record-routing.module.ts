import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {RecordFormComponent} from "./record-form/record-form.component";
import {RecordViewComponent} from "./record-view/record-view.component";
import {PatientViewComponent} from "../patient/patient-view/patient-view.component";
import {RecordComponent} from "./record.component";


const routes:Routes=[
  {path:"",component:RecordComponent},
  {path:"new/:id",component:RecordFormComponent},
  {path:"new",component:RecordFormComponent},
  {path:"all",component:RecordViewComponent},
  {path:"modify/:id",component:RecordFormComponent}

]
@NgModule({imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]})
export class RecordRoutingModule { }
