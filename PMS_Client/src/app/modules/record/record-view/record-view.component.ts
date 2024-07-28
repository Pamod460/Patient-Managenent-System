import {Component, OnInit} from '@angular/core';
import {DialogComponent} from "../../../utils/dialog/dialog.component";
import {MedRecord} from "../../../entity/MedRecord";
import {RecordService} from "../../../services/record.service";
import {MatDialog} from "@angular/material/dialog";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-record-view',
  templateUrl: './record-view.component.html',
  styleUrls: ['./record-view.component.scss']
})
export class RecordViewComponent implements OnInit{

  records: MedRecord[] = [];
  filteredRecords: MedRecord[] = [];
  displayedColumns: string[] = ['id', 'patient_id', 'record_date', 'complaints', 'history', 'diagnosed', 'treatment', 'next_review', 'charges', 'delete', 'modify', 'medrec'];
  searchForm: FormGroup;

  constructor(private recordService: RecordService, private dialog: MatDialog,private fb: FormBuilder) {

    this.searchForm = this.fb.group({
      searchName: [''],
      searchBirthday: [''],
      searchRecordDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadAll();
    this.searchForm.valueChanges.subscribe(() => {
      this.search();
    });
  }
  search() {
    const { searchName, searchBirthday, searchRecordDate } = this.searchForm.value;

    this.filteredRecords = this.records.filter(record => {
      // @ts-ignore
      const matchesName = searchName ? record.patient?.name.includes(searchName) : true;
      // @ts-ignore
      const matchesBirthday = searchBirthday ? new Date(record.patient?.birthday).toLocaleDateString() === new Date(searchBirthday).toLocaleDateString() : true;
      // @ts-ignore
      const matchesRecordDate = searchRecordDate ? new Date(record.record_date).toLocaleDateString() === new Date(searchRecordDate).toLocaleDateString() : true;
      return matchesName && matchesBirthday && matchesRecordDate;
    });
    console.log(this.filteredRecords)
  }
  async loadAll() {
    await  this.recordService.getAllRecords().then(records=>{
      // @ts-ignore
      this.records = records["records"];
        console.log(this.records)
        this.filteredRecords=this.records
    }) .catch(error => {
        console.error('Error fetching patients:', error);
        // this.toastr.error('Failed to load patients');
      });


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
