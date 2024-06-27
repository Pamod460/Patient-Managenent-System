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
    // console.log(str)
    return this.isBase64Image(str) && this.isUTF8(str);
  }
   isUTF8(str: string): boolean {
     try {
       const utf8Bytes = new TextEncoder().encode(str);
       const decodedStr = new TextDecoder('utf-8').decode(utf8Bytes);
       return decodedStr === str;
     } catch (e) {
       return false;
     }
}

  private isBase64Image(str: string) {
    const base64Pattern = /^data:image\/(jpeg|png|gif|bmp|webp);base64,/;
    if (!base64Pattern.test(str)) {
      return false;
    }
    // Extract the base64 part after the prefix and check if it is valid
    const base64Data = str.split(',')[1];
    try {
      atob(base64Data);
      return true;
    } catch (e) {
      return false;
    }
  }
}
