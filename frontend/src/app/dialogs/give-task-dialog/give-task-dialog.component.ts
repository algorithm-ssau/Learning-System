import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-give-task-dialog',
  templateUrl: './give-task-dialog.component.html',
  styleUrls: ['./give-task-dialog.component.css', '../style.css']
})
export class GiveTaskDialogComponent {
  taskData = {
    taskId: '1',
    studentId: 'all'
  }
  constructor(private dialogRef: MatDialogRef<GiveTaskDialogComponent>){}
  onCancel(): void{
    this.dialogRef.close()
  }

  onAdd(): void{
    this.dialogRef.close(this.taskData)
  }
}
