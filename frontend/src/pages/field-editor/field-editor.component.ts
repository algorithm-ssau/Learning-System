import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { GameStateService, GameField, Task } from 'src/services/game-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-field-editor',
  templateUrl: './field-editor.component.html',
  styleUrls: ['./field-editor.component.css']
})
export class FieldEditorComponent implements OnInit{

  editorForm: FormGroup;
  width: number = 10;
  height: number = 10;
  gameField: number[] = Array(this.width * this.height).fill(0);
  gameElements = [
    { name: 'Empty', image: 'assets/empty.png', count: 0, max: this.width * this.height, index: 0},
    { name: 'Rock', image: 'assets/rock.png', count: 0, max: 30, index: 1 },
    { name: 'Coin', image: 'assets/coin.png', count: 0, max: 10, index: 2 },
    { name: 'Hole', image: 'assets/hole.png', count: 0, max: 20, index: 3 },
    { name: 'Ant', image: 'assets/ant.png', count: 0, max: 1, index: 4 }
  ];

  constructor(
    private router: Router, 
    private fb: FormBuilder,
    private gs: GameStateService
  ) {
    this.editorForm = this.fb.group({
      "taskName": new FormControl("", {validators: [Validators.required, Validators.maxLength(30)]}),
      "taskText": new FormControl("", {validators: [Validators.required, Validators.maxLength(200)]}),
      "energy": new FormControl(1, {validators: [Validators.required, Validators.min(1), Validators.max(50)]})
    })
  }

  ngOnInit() {
    const gameData: GameField = this.gs.getGameField();
    this.gameField = Array(gameData.width * gameData.height).fill(0);
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

  onDrop(event: DragEvent, index: number) {
    event.preventDefault();
    const elementType = event.dataTransfer?.getData('text');
  
    if (elementType) {
      const elementIndex = this.gameElements.findIndex(e => e.name === elementType);
  
      if (elementIndex !== -1 && this.gameElements[elementIndex].count < this.gameElements[elementIndex].max) {
        const oldElementIndex = this.gameField[index]; // Получаем текущий элемент в клетке
  
        // Если заменяемый элемент не пуст (-1), уменьшаем его количество
        if (oldElementIndex !== -1) {
          const oldElement = this.gameElements[oldElementIndex];
          if (oldElement.count > 0) {
            oldElement.count--;
          }
        }
  
        // Устанавливаем новый элемент
        this.gameField[index] = elementIndex;
        this.gameElements[elementIndex].count++;
      }
    }
  }

  onDragStart(event: DragEvent, elementType: string) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text', elementType);
    }
  }

  saveTask() {
    if (this.editorForm.valid) {
      const taskData: Task = {
        name: this.editorForm.value.taskName,
        text: this.editorForm.value.taskText,
        energy: this.editorForm.value.energy,
        id_field: 1
      };
      this.gs.saveTask(taskData);
    } else {
      alert('Форма заполнена некорректно!');
    }
  }
}
