import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {PatientFormComponent} from "./patient-form/patient-form.component";
import {PatientViewComponent} from "./patient-view/patient-view.component";
import {PatientComponent} from "./patient.component";
import {PatientProfileComponent} from "./patient-profile/patient-profile.component";


const routes: Routes = [
  {path:"",component:PatientComponent},
  {path: "new", component: PatientFormComponent},
  {path: "modify/:id", component: PatientFormComponent},
  {path: "all", component: PatientViewComponent},
  {path: "profile/:id", component: PatientProfileComponent},
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule {
}
