import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { GameStateService, GameField, GameElement } from 'src/services/game-state.service';
import { Task } from 'src/services/evaluation.service';
import { Router } from '@angular/router';
import { DialogService } from 'src/services/dialog.service';

@Component({
  selector: 'app-field-editor',
  templateUrl: './field-editor.component.html',
  styleUrls: ['./field-editor.component.css']
})
export class FieldEditorComponent implements OnInit{

  fieldID?: number; // По умолчанию считаем, что создаём новое задание
  editorForm: FormGroup;
  width: number = 10;
  height: number = 10;
  gameField: number[] = Array(this.width * this.height).fill(0);
  gameElements: GameElement [] = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private gs: GameStateService,
    private dialogService: DialogService,
  ) {
    this.editorForm = this.fb.group({
      "taskName": new FormControl("", {validators: [Validators.required, Validators.maxLength(30)]}),
      "taskText": new FormControl("", {validators: [Validators.required, Validators.maxLength(200)]}),
      "energy": new FormControl(1, {validators: [Validators.required, Validators.min(1), Validators.max(50)]}),
    })
  }

  ngOnInit() {
    this.gameElements = this.gs.getGameElements();
    const taskType = this.gs.getTaskType();
    // Подставим текст в зависимости от типа
    const taskTextMap: Record<number, string> = {
      1: 'Соберите все монеты',
      2: 'Переместите все камни в лунки',
      3: 'Соберите монеты и поместите камни в лунки'
    };
    this.editorForm = this.fb.group({
      "taskName": new FormControl("", {validators: [Validators.required, Validators.maxLength(30)]}),
      "taskText": new FormControl({value: taskTextMap[taskType], disabled: true}, {validators: [Validators.required, Validators.maxLength(200)]}),
      "energy": new FormControl(1, {validators: [Validators.required, Validators.min(1), Validators.max(50)]}),
    })
    this.gs.getGameField().subscribe((gameData: GameField) => {
      if (gameData.id_game_field) {
        this.fieldID = gameData.id_game_field;
      }

      if (gameData.layout_array && gameData.layout_array.length) {
        this.gameField = [...gameData.layout_array];
      } else {
        this.gameField = Array(gameData.width * gameData.length).fill(0);
      }

      this.editorForm.patchValue({ energy: gameData.energy });

      this.updateElementCountsFromField();
    });
  }

  deleteTask(){
    this.dialogService.openDeleteTaskDialog();
  }

  private updateElementCountsFromField(): void {
    // Обнуляем сначала все счётчики
    this.gameElements.forEach(element => element.count = 0);

    // Проходим по каждой клетке поля
    for (const cell of this.gameField) {
      if (cell !== -1) {
        // Находим элемент по индексу
        const element = this.gameElements.find(e => e.index === cell);
        if (element) {
          element.count++;
        }
      }
    }
  }

  goToJournal() {
    this.router.navigate(['/teacherjournal']);
  }

  getElementImage(type: number): string {
    return this.gs.getElementImage(type);
  }

  get gridRows() {
    const rows = [];
    for (let i = 0; i < this.gameField.length; i += this.width) {
      rows.push(this.gameField.slice(i, i + this.width));
    }
    return rows;
  }
  get gridStyle() {
    return {
      'grid-template-columns': `repeat(${this.width}, 60px)`,
      'grid-template-rows': `repeat(${this.height}, 60px)`
    }
  }

  getElementStyle() {
    const cellSize = 58;
    return {
      width: `${cellSize}px`,
      height: `${cellSize}px`,
      'object-fit': 'contain' // Чтобы изображение не обрезалось
    };
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent, targetIndex: number) {
    event.preventDefault(); // обязательно!

    // Читаем индекс перетаскиваемого элемента
    const elementIndex = parseInt(event.dataTransfer?.getData('text/plain') || '-1', 10);

    if (elementIndex === -1) return; // если не нашли индекс

    const draggedElement = this.gameElements.find(e => e.index === elementIndex);

    if (!draggedElement) return; // если элемент не найден

    // Проверка лимита элементов
    if (draggedElement.count < draggedElement.max) {
      const oldElementIndex = this.gameField[targetIndex];

      // Если на клетке уже что-то стояло, уменьшаем его count
      if (oldElementIndex !== -1) {
        const oldElement = this.gameElements.find(e => e.index === oldElementIndex);
        if (oldElement && oldElement.count > 0) {
          oldElement.count--;
        }
      }

      // Ставим новый элемент на игровое поле
      this.gameField[targetIndex] = draggedElement.index;
      draggedElement.count++;
    }
  }

  onDragStart(event: DragEvent, element: GameElement) {
    event.dataTransfer?.setData('text/plain', element.index.toString());
  }

  get canSave(): boolean {
    const ant = this.gameElements.find(e => e.index === 4);
    return !!ant && ant.count > 0;
  }

  saveTask() {
    if (!this.editorForm.valid) {
      alert('Форма заполнена некорректно!');
      return;
    }
  
    const taskName = this.editorForm.value.taskName;
    const type = this.gs.getTaskType();
    const energy = this.editorForm.value.energy;
  
    const baseField: Omit<GameField, 'fieldID'> = {
      width: this.width,
      length: this.height,
      energy,
      layout_array: this.gameField,
    };
  
    if (this.fieldID) {
      // Обновление поля
      this.gs.sendGameField({ ...baseField, id_game_field: this.fieldID }).subscribe(() => {
        const newTask: Task = {
          name: taskName,
          gameFieldID: this.fieldID!,
          goal: type
        };
  
        this.gs.sendTask(newTask).subscribe(() => {
          alert('Задание и поле успешно сохранены!');
        });
      });
    } else {
      // Создание нового поля
      this.gs.newGameFieldId(baseField as GameField).subscribe((savedField: GameField) => {
        const newTask: Task = {
          name: taskName,
          gameFieldID: savedField.id_game_field!,
          goal: type
        };
  
        this.gs.sendTask(newTask).subscribe(() => {
          alert('Задание и поле успешно сохранены!');
        });
      });
    }
  }
}

