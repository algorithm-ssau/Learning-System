import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-task-dialog',
  templateUrl: './delete-task-dialog.component.html',
  styleUrls: ['./delete-task-dialog.component.css', ]
})
export class DeleteTaskDialogComponent {
  isModalOpen: boolean = false;  // Статус модального окна

  constructor(private dialogRef: MatDialogRef<DeleteTaskDialogComponent>,
  private router: Router,
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  // Закрытие модального окна
  closeModal(): void {
    this.dialogRef.close()
  }

  // Действие при подтверждении удаления
  confirmDelete(): void {
    // Логика для удаления задания
    console.log('Задание удалено');
    this.dialogRef.close()
    // Переход на страницу /teacherjournal
    this.router.navigate(['/teacherjournal']);
  }
}
