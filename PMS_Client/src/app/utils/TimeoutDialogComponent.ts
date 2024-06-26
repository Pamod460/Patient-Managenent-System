// src/app/timeout-dialog/timeout-dialog.component.ts

import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-timeout-dialog',
  template: `

    <div mat-dialog-content>
      <p>Your session has expired due to inactivity.</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="close()">OK</button>
    </div>
  `,
  styles: [
  '    div[mat-dialog-content] {\n' +
  '      background-color: #32a6a8; \n' +
  '    }\n' +
  '    div[mat-dialog-actions] {\n' +
  '      background-color: #32a6a8; \n' +
  '    }\n' +
  '    button {\n' +
  '      color: #3f51b5; \n' +
  '    }']
})
export class TimeoutDialogComponent {
  constructor(public dialogRef: MatDialogRef<TimeoutDialogComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
