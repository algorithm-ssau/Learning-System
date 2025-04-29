import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
  selectedClass: string;
  tasksData: any[];
  studentsData: any[];
}

@Component({
  selector: 'app-give-task-dialog',
  templateUrl: './give-task-dialog.component.html',
  styleUrls: ['./give-task-dialog.component.css', '../style.css']
})
export class GiveTaskDialogComponent {
  taskData = {
    taskId: '',
    studentId: 'all'
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<GiveTaskDialogComponent>
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onAdd(): void {
    if (!this.taskData.taskId) {
      alert('Пожалуйста, выберите задание');
      return;
    }
    this.dialogRef.close(this.taskData);
  }
}