import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ReportCustomViewComponent} from "./report-custom-view/report-custom-view.component";
import {ReportDailyViewComponent} from "./report-daily-view/report-daily-view.component";
import {ReportComponent} from "./report.component";


const routes:Routes=[
  {path:"",component:ReportComponent},
  {path:"custom",component:ReportCustomViewComponent},
  {path:"daily",component:ReportDailyViewComponent}
];

@NgModule(
{imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]})
export class ReportRoutingModule { }
