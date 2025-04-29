import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { GameStateService, GameField, GameElement } from 'src/services/game-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-field-editor',
  templateUrl: './field-editor.component.html',
  styleUrls: ['./field-editor.component.css']
})
export class FieldEditorComponent implements OnInit{

  isNewTask: boolean = true; // По умолчанию считаем, что создаём новое задание
  editorForm: FormGroup;
  width: number = 10;
  height: number = 10;
  gameField: number[] = Array(this.width * this.height).fill(0);
  gameElements: GameElement [] = [];
  collectCoins: boolean = false; // локальная переменная для флага

  constructor(
    private router: Router, 
    private fb: FormBuilder,
    private gs: GameStateService
  ) {
    this.editorForm = this.fb.group({
      "taskName": new FormControl("", {validators: [Validators.required, Validators.maxLength(30)]}),
      "taskText": new FormControl("", {validators: [Validators.required, Validators.maxLength(200)]}),
      "energy": new FormControl(1, {validators: [Validators.required, Validators.min(1), Validators.max(50)]}),
    })
  }

  ngOnInit() {
    this.gameElements = this.gs.getGameElements();
  
    this.gs.getGameField().subscribe((gameData: GameField) => {
      if (gameData.fieldID) {
        this.isNewTask = false;
      }
  
      if (gameData.gameField && gameData.gameField.length) {
        this.gameField = [...gameData.gameField];
      } else {
        this.gameField = Array(gameData.width * gameData.height).fill(-1);
      }
  
      this.editorForm.patchValue({ energy: gameData.energy });
  
      this.collectCoins = gameData.collectCoins;
      this.updateElementCountsFromField();
    });
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
    this.router.navigate(['/journal']);
  }

  getElementImage(type: number): string {
    const element = this.gameElements.find(e => e.index === type);
    return element ? element.image : 'assets/empty.png';
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
    };
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
  
    // Ограничение: нельзя ставить монету, если сбор монет отключён
    if (draggedElement.name === 'Coin' && !this.collectCoins) {
      console.warn('Сбор монет отключён — нельзя добавить монету.');
      return; // ПРЕКРАЩАЕМ операцию
    }
  
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
    const ant = this.gameElements.find(e => e.name === 'Ant');
    return !!ant && ant.count > 0 && this.editorForm.valid;
  }

  saveTask() {
    if (this.editorForm.valid) {
      const baseField: Omit<GameField, 'fieldID'> = {
        width: this.width,
        height: this.height,
        energy: this.editorForm.value.energy,
        gameField: this.gameField,
        collectCoins: this.collectCoins
      };
  
      this.gs.newGameFieldId(baseField as GameField, this.isNewTask)
        .subscribe((gfWithId: GameField) => {
          this.gs.sendGameField(gfWithId).subscribe(() => {
            alert('Игровое поле сохранено!');
          });
        });
  
    } else {
      alert('Форма заполнена некорректно!');
    }
  }

  deleteTask(){

  }
}
