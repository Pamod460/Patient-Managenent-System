import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  isUTF8Encoded = false;
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, message: string,changes:any[] }
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {

    this.dialogRef.close(true);
  }
  checkUTF8(str: string): boolean {
    return this.isUTF8(str);
  }
   isUTF8(str: string): boolean {
  try {
    const utf8Bytes = new TextEncoder().encode(str);
    const decodedStr = new TextDecoder('utf-8').decode(utf8Bytes);
    return decodedStr === str;
  } catch (e) {
    return false;
  }
}}
