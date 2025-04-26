import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
  styleUrls: ['./add-task-dialog.component.css', '../style.css']
})
export class AddTaskDialogComponent {
  taskData = {
    width: 10,
    length: 10,
    type: '',
    creationMethod: '',
    stonesQuantity: 1,
    holesQuantity: 1,
    coinsQuantity: 1
  }

  constructor(private dialogRef: MatDialogRef<AddTaskDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onAdd(): void {
    this.dialogRef.close(this.taskData);
  }
}
