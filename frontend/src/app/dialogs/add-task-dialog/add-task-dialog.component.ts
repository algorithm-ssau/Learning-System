import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TaskData } from 'src/services/game-state.service';

@Component({
  selector: 'app-add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
  styleUrls: ['./add-task-dialog.component.css', '../style.css']
})
export class AddTaskDialogComponent {
  taskData = {
    width: 10,
    heigth: 10,
    type: '',
    creationMethod: '',
    stonesQuantity: 0,
    holesQuantity: 0,
    coinsQuantity: 0
  }

  constructor(private dialogRef: MatDialogRef<AddTaskDialogComponent>) {}

  onTypeChange(): void {
    if (this.taskData.type === 'place-stones') {
      this.taskData.coinsQuantity = 0;
    }
  }
  
  onMethodChange(): void {
    if (this.taskData.creationMethod === 'manual') {
      this.taskData.stonesQuantity = 0;
      this.taskData.holesQuantity = 0;
      this.taskData.coinsQuantity = 0;
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onAdd(): void {
    const data: TaskData = {
      width: this.taskData.width,
      length: this.taskData.heigth,
      type: this.taskData.type,
      createMethod: this.taskData.creationMethod,
      rocks: Math.floor(this.taskData.stonesQuantity * this.taskData.width * this.taskData.heigth / 100),
      holes: Math.floor(this.taskData.holesQuantity * this.taskData.width * this.taskData.heigth / 100),
      coins: Math.floor(this.taskData.coinsQuantity * this.taskData.width * this.taskData.heigth/ 100)
    }
    this.dialogRef.close(data);
  }
}
