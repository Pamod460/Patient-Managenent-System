import {Component, OnInit} from '@angular/core';
// @ts-ignore
import * as html2pdf from 'html2pdf.js';
import {ReportService} from '../../../services/report.service';
import {Report} from '../../../entity/report';

@Component({
  selector: 'app-report-daily-view',
  templateUrl: './report-daily-view.component.html',
  styleUrls: ['./report-daily-view.component.scss']
})
export class ReportDailyViewComponent implements OnInit {
  dailyRecords?: any = [];
  totalCharges: number | undefined;
  private result: Report = {};
  currentDate: string;
  constructor(private reportService: ReportService) {
    this.currentDate = new Date().toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.loadReport();
  }

  async loadReport() {
    try {
      this.reportService.getDailyReport().then( result=>{
        // @ts-ignore
        this.dailyRecords =result['daily_report']
        // @ts-ignore
        this.totalCharges = result['total'];

        }

      );

      // this.dailyRecords = this.result.records;
      // @ts-ignore
      this.totalCharges = this.result.total['total'];
    } catch (error) {
      console.error('Error loading report:', error);
    }
  }

  downloadReport(): void {
    const element = document.getElementById('report-container')!;
    const date = new Date();
    const opt = {
      margin: 0.5,
      filename: `daily_report_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.pdf`,
      image: {type: 'jpeg', quality: 0.98},
      html2canvas: {scale: 2},
      jsPDF: {unit: 'in', format: 'a4', orientation: 'portrait'}
    };

    html2pdf().from(element).set(opt).save();
  }
}
