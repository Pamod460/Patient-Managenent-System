import { Component, OnInit } from '@angular/core';
import { PatientService } from "../../../services/patient.service";
import { Patient } from "../../../entity/Patient";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../../../utils/dialog/dialog.component";
import { FormBuilder, FormGroup } from "@angular/forms";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-patient-view',
  templateUrl: './patient-view.component.html',
  styleUrls: ['./patient-view.component.scss']
})
export class PatientViewComponent implements OnInit {
  patients: Patient[] = [];
  searchForm: FormGroup;
  displayedColumns: string[] = ['name', 'age', 'birthday', 'contact', 'gender', 'registered_date', 'delete', 'modify', 'medrec'];
  filteredPatients: Patient[] = [];

  constructor(private patientService: PatientService, private dialog: MatDialog, private fb: FormBuilder,private toastr:ToastrService) {
    this.searchForm = this.fb.group({
      birthday: [''],
      name: ['']
    });
  }

  ngOnInit(): void {
    this.loadAll();
    this.searchForm.valueChanges.subscribe(values => {
      this.filterPatients(values);
    });
  }

  async loadAll(): Promise<void> {
    await this.patientService.getAllPatients()
      .then(patients => {
        // @ts-ignore
        this.patients = patients['patients'];
       this.filteredPatients=this.patients
      })
      .catch(error => {
        console.error('Error fetching patients:', error);
        this.toastr.error('Failed to load patients');
      });
  }

  filterPatients(values: any): void {
    const name = values.name.toLowerCase();
    const birthday = values.birthday ? new Date(values.birthday).toDateString() : '';

    this.filteredPatients = this.patients.filter(patient => {
      const patientName = patient.name?.toLowerCase();
      // @ts-ignore
      const patientBirthday = new Date(patient.birthday).toDateString();
      return (
        (name === '' || patientName?.includes(name)) &&
        (birthday === '' || patientBirthday === birthday)
      );
    });
    console.log(this.filteredPatients);
  }

  delete(patient: Patient): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title: 'Delete Patient', message: 'Are you sure you want to delete this patient?\n' + patient.name },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.patientService.remove(patient.id).then( res => {
            this.loadAll(); // Reload the patient list after deletion
            console.log(res);
          },
          error => {
            console.error('Error deleting patient', error);
          })

      }
    });
  }
}
