import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReportComponent} from './report.component';
import {ReportRoutingModule} from "./report-routing.module";
import { ReportFormComponent } from './report-form/report-form.component';
import { ReportViewComponent } from './report-view/report-view.component';
import { ReportDailyViewComponent } from './report-daily-view/report-daily-view.component';
import { ReportCustomViewComponent } from './report-custom-view/report-custom-view.component';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";


@NgModule({
  declarations: [
    ReportComponent,
    ReportFormComponent,
    ReportViewComponent,
    ReportDailyViewComponent,
    ReportCustomViewComponent
  ],
    imports: [
        CommonModule, ReportRoutingModule, MatCardModule, MatIconModule
    ]
})
export class ReportModule {
}
