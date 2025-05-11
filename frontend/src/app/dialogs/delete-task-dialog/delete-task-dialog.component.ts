import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GameStateService } from 'src/services/game-state.service';

@Component({
  selector: 'app-delete-task-dialog',
  templateUrl: './delete-task-dialog.component.html',
  styleUrls: ['./delete-task-dialog.component.css', ]
})
export class DeleteTaskDialogComponent {
  isModalOpen: boolean = false;  // Статус модального окна

  constructor(
    private dialogRef: MatDialogRef<DeleteTaskDialogComponent>,
    private router: Router,
    private gs: GameStateService,
    @Inject(MAT_DIALOG_DATA) public data: {fieldID: number}
  ) {}

  // Закрытие модального окна
  closeModal(): void {
    this.dialogRef.close()
  }

  // Действие при подтверждении удаления
  confirmDelete(): void {
    // Логика для удаления задания
    this.gs.deleteTask(this.data.fieldID).subscribe({
      next: () => {
        console.log('Задание удалено');
        this.dialogRef.close();
        this.router.navigate(['/teacherjournal']);
      },
      error: (err) => {
        console.error('Ошибка при удалении:', err);
      }
    });
  }
}
