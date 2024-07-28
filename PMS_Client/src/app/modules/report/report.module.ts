import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReportComponent} from './report.component';
import {ReportRoutingModule} from "./report-routing.module";

import { ReportDailyViewComponent } from './report-daily-view/report-daily-view.component';
import { ReportCustomViewComponent } from './report-custom-view/report-custom-view.component';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";


@NgModule({
  declarations: [
    ReportComponent,
    ReportDailyViewComponent,
    ReportCustomViewComponent
  ],
    imports: [
        CommonModule, ReportRoutingModule, MatCardModule, MatIconModule
    ]
})
export class ReportModule {
}
