import { NgModule } from '@angular/core';
import { RouterModule, Routes} from "@angular/router";
import {UserFormComponent} from "./user-form/user-form.component";
import {UserViewComponent} from "./user-view/user-view.component";


const routes:Routes=[
  {path:"new",component:UserFormComponent},
  {path:"all",component:UserViewComponent}
]

@NgModule({imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]})
export class UserRoutingModule { }
