import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-student-dialog',
  templateUrl: './add-student-dialog.component.html',
  styleUrls: ['./add-student-dialog.component.css','../style.css']
})
export class AddStudentDialogComponent {
  studentData = {
    name: '',
    login: '',
    password: '',
  }

  constructor(private dialogRef: MatDialogRef<AddStudentDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onAdd(): void {
    this.dialogRef.close(this.studentData);
  }
}
