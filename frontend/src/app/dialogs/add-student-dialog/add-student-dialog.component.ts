import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/services/api.service';
import { NgForm } from '@angular/forms';

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

  constructor(private dialogRef: MatDialogRef<AddStudentDialogComponent>, 
              private apiService: ApiService) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onAdd(form: NgForm): void {
    if (form.valid) {
      this.dialogRef.close(this.studentData);
    }
  }
}