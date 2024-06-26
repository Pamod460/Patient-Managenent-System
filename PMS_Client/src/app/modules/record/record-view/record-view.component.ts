import {Component, OnInit} from '@angular/core';
import {DialogComponent} from "../../../utils/dialog/dialog.component";
import {MedRecord} from "../../../entity/MedRecord";
import {RecordService} from "../../../services/record.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-record-view',
  templateUrl: './record-view.component.html',
  styleUrls: ['./record-view.component.scss']
})
export class RecordViewComponent implements OnInit{

  records: MedRecord[] = [];
  displayedColumns: string[] = ['id', 'patient_id', 'record_date', 'complaints', 'history', 'diagnosed', 'treatment', 'next_review', 'charges', 'delete', 'modify', 'medrec'];

  constructor(private recordService: RecordService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadAll();
  }

  async loadAll() {
    this.records = await this.recordService.getAllRecords();
    // @ts-ignore
    this.records = this.records["records"];
    console.log(this.records);
  }

  async delete(record: MedRecord) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title: 'Delete Record', message: 'Are you sure you want to delete this record?\n' + record.id },
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.recordService.remove(record.id);
        this.loadAll();
      }
    });
  }
}
