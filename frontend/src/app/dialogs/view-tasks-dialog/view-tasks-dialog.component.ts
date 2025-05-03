import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
  tasksData: any[];
}

@Component({
  selector: 'app-view-tasks-dialog',
  templateUrl: './view-tasks-dialog.component.html',
  styleUrls: ['./view-tasks-dialog.component.css', ]
})
export class ViewTasksDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<ViewTasksDialogComponent>
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }
}
