import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddStudentDialogComponent } from '../app/dialogs/add-student-dialog/add-student-dialog.component'
import { GiveTaskDialogComponent } from '../app/dialogs/give-task-dialog/give-task-dialog.component';
import { AddTaskDialogComponent } from '../app/dialogs/add-task-dialog/add-task-dialog.component';
import { ViewTasksDialogComponent } from '../app/dialogs/view-tasks-dialog/view-tasks-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    constructor(private dialog: MatDialog) {}

    openAddStudentDialog() {
        return this.dialog.open(AddStudentDialogComponent, {
          hasBackdrop: true,
          disableClose: false,
          autoFocus: false,
          backdropClass: 'dialog-backdrop',
          panelClass: 'centered-dialog',
        });
      }

    openGiveTaskDialog(data: any): MatDialogRef<GiveTaskDialogComponent> {
        return this.dialog.open(GiveTaskDialogComponent, {
            data: data,
            width: '500px',
            hasBackdrop: true,
            disableClose: false,
            autoFocus: false,
            backdropClass: 'dialog-backdrop',
            panelClass: 'centered-dialog',
          });
    }

    openAddTaskDialog() {
        return this.dialog.open(AddTaskDialogComponent, {
            hasBackdrop: true,
            disableClose: false,
            autoFocus: false,
            backdropClass: 'dialog-backdrop',
            panelClass: 'centered-dialog',
          });
    }

    openViewTaskDialog() {
        return this.dialog.open(ViewTasksDialogComponent, {
            hasBackdrop: true,
            disableClose: false,
            autoFocus: false,
            backdropClass: 'dialog-backdrop',
            panelClass: 'centered-dialog',
          });
    }
}