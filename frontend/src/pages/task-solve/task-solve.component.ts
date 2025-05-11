import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { EvaluationService } from 'src/services/evaluation.service';
import { Router } from '@angular/router';
import { GameElement, GameField, GameStateService } from 'src/services/game-state.service';
import { SimulationService } from 'src/services/simulation.service';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-task-solve',
  templateUrl: './task-solve.component.html',
  styleUrls: ['./task-solve.component.css']
})
export class TaskSolveComponent implements OnInit{
  taskID: number = 1;
  studentID: string = 'student10A1';
  fieldID: number = 4;
  algorithmForm: FormGroup;
  taskDescription: string = '';
  consoleMessages: string[] = [];
  maxCommands: number = 10;
  draggedCommand: string | null = null;
  draggedFromCommands: FormArray | null = null;
  draggedCommandIndex: number | null = null;
  droppedSuccessfully = false;
  commandWasMoved = false;
  width = 10;
  height = 10;
  initialGameField: number[] = [];
  gameField$ = this.gs.gameField$;
  isRunning = false;

  commandsList = [
    { name: 'вверх', label: '↑ Вверх' },
    { name: 'вниз', label: '↓ Вниз' },
    { name: 'вправо', label: '→ Вправо' },
    { name: 'влево', label: '← Влево' },
    { name: 'цикл', label: '⭮ Цикл' }
  ];

  constructor(
    private fb: FormBuilder,
    private evaluationService: EvaluationService,
    private gs: GameStateService,
    private router: Router,
    private ss: SimulationService,
    private cdr: ChangeDetectorRef
  ) {
    this.algorithmForm = this.fb.group({
      commands: this.fb.array([])
    });
  }

  ngOnInit(): void {
    
    this.evaluationService.getTaskDetails(this.taskID, this.studentID).subscribe(task => {
      console.log(task);
      const goal = task[0].id_goal;
      const taskTextMap: Record<number, string> = {
        1: 'Соберите все монеты',
        2: 'Переместите все камни в лунки',
        3: 'Соберите монеты и поместите камни в лунки'
      };
      console.log("Тип задания:", goal);
      this.taskDescription = taskTextMap[goal];
      console.log(this.taskDescription);
      this.width = task[1].width;
      this.height = task[1].height;
      this.maxCommands = task[1].energy;
      this.initialGameField = [...task[1].layout_array];
      if (task[1].id_game_field) this.fieldID = task[1].id_game_field;
    });
    this.gameField$.pipe(
      tap(() => {
        this.cdr.markForCheck(); // Принудительное обновление
        console.log('Поле обновлено в UI');
      })
    ).subscribe();
    this.gs.getGameField().pipe();
  }

  get commands(): FormArray {
    return this.algorithmForm.get('commands') as FormArray;
  }

  asFormGroup(control: AbstractControl | null): FormGroup {
    return control as FormGroup;
  }

  goToJournal(): void {
    this.router.navigate(['/studentjournal']);
  }

  asFormArray(control: AbstractControl | null): FormArray {
    return control as FormArray;
  }

  getTotalCommandCount(): number {
    const countCommands = (commands: FormArray): number => {
      let count = 0;
      commands.controls.forEach(command => {
        count++;
        if (command.get('type')?.value === 'цикл') {
          const subCommands = command.get('subCommands') as FormArray;
          count += countCommands(subCommands);
        }
      });
      return count;
    };
  
    return countCommands(this.commands);
  }

  addCommand(type: string, parentArray?: FormArray): void {
    const command = this.fb.group({
      type: new FormControl(type),
      text: new FormControl(type === 'цикл' ? 'цикл' : type),
      iterations: new FormControl(type === 'цикл' ? 2 : null),
      subCommands: this.fb.array([]) // Вложенные команды для цикла
    });

    if (parentArray) {
      parentArray.push(command);
    } else {
      this.commands.push(command);
    }
  }

  dragCommand(type: string, parentArray?: FormArray, index?: number): void {
    if (parentArray && index !== undefined) {
      this.draggedCommand = parentArray.at(index).get('type')?.value;
      this.draggedFromCommands = parentArray;
      this.draggedCommandIndex = index;
    } else {
      this.draggedCommand = type;
      this.draggedFromCommands = null;
      this.draggedCommandIndex = null;
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  dropCommand(index: number, parentArray?: FormArray): void {
    if (!this.draggedCommand) return;
  
    const targetArray = parentArray || this.commands;
    this.droppedSuccessfully = true;
    this.commandWasMoved = true; // 🆕
  
    const totalCount = this.getTotalCommandCount();
    if (totalCount >= this.maxCommands) {
      alert(`Нельзя добавить больше ${this.maxCommands} команд`);
      this.clearDragState();
      return;
    }
  
    if (this.draggedCommand === 'цикл') {
      const depth = this.calculateDepth(parentArray || this.commands);
      if (depth > 3) {
        alert('Нельзя вложить более 3 уровней циклов!');
        this.clearDragState();
        return;
      }
    }
  
    if (this.draggedFromCommands && this.draggedCommandIndex !== null) {
      const moved = this.draggedFromCommands.at(this.draggedCommandIndex);
      this.draggedFromCommands.removeAt(this.draggedCommandIndex);
  
      const correctedIndex = (this.draggedFromCommands === targetArray && this.draggedCommandIndex < index)
        ? index - 1 : index;
  
      targetArray.insert(correctedIndex, moved);
    } else {
      const command = this.fb.group({
        type: new FormControl(this.draggedCommand),
        text: new FormControl(this.draggedCommand === 'цикл' ? 'цикл' : this.draggedCommand),
        iterations: new FormControl(this.draggedCommand === 'цикл' ? 2 : null),
        subCommands: this.fb.array([])
      });
      targetArray.insert(index, command);
    }
  
    this.clearDragState();
  }

  isLastCommand(index: number, array: FormArray): boolean {
    return index === array.length - 1;
  }
  
  clearDragState(): void {
    this.draggedCommand = null;
    this.draggedFromCommands = null;
    this.draggedCommandIndex = null;
    this.droppedSuccessfully = false;
    this.commandWasMoved = false;
  }

  calculateDepth(control: AbstractControl | null): number {
    let depth = 1;
    let current = control;
    while (current?.parent) {
      const parent = current.parent;
      if (parent instanceof FormGroup && parent.contains('subCommands')) {
        depth++;
        current = parent.parent; // Переход к следующему уровню
      } else {
        break;
      }
    }
    return depth;
  }

  handleDropOutside(): void {
    if (this.draggedFromCommands && this.draggedCommandIndex !== null) {
      this.draggedFromCommands.removeAt(this.draggedCommandIndex);
    }
    this.clearDragState();
  }

  onDragEnd(): void {
    if (!this.droppedSuccessfully &&
        !this.commandWasMoved &&
        this.draggedFromCommands &&
        this.draggedCommandIndex !== null) {
      this.draggedFromCommands.removeAt(this.draggedCommandIndex);
    }
    this.clearDragState();
  }

  get gridStyle() {
    return {
      display: 'grid',
      'grid-template-columns': `repeat(${this.width}, 60px)`,
      'grid-template-rows': `repeat(${this.height}, 60px)`,
      gap: '2px'
    };
  }

  getElementImage(type: number): string {
    return this.gs.getElementImage(type);
  }

  getElementStyle() {
    const cellSize = 58;
    return {
      width: `${cellSize}px`,
      height: `${cellSize}px`,
      'object-fit': 'contain' // Чтобы изображение не обрезалось
    };
  }

  convertAlgorithmToString(): string {
    const commandMap: { [key: string]: number } = {
      'вверх': 0,
      'вниз': 1,
      'вправо': 2,
      'влево': 3,
      'цикл': 4,
      'конец_цикла': 5
    };
  
    const processCommands = (commands: FormArray): number[] => {
      const result: number[] = [];
  
      for (const command of commands.controls) {
        const type = command.get('type')?.value;
  
        if (type === 'цикл') {
          const iterations = +command.get('iterations')?.value || 2;
          result.push(commandMap['цикл'], iterations);
  
          const subCommands = processCommands(command.get('subCommands') as FormArray);
          result.push(...subCommands);
  
          result.push(commandMap['конец_цикла']);
        } else {
          const text = command.get('text')?.value;
          if (text in commandMap) {
            result.push(commandMap[text]);
          }
        }
      }
  
      return result;
    };
  
    return processCommands(this.commands).join(',');
  }

  submitSolution(): void {
    const solutionString = this.convertAlgorithmToString();
    console.log(this.studentID, this.taskID, solutionString);
    
    this.evaluationService.submitSolution(this.studentID, this.taskID, solutionString)
      .subscribe(() => this.router.navigate(['/studentjournal']));
  }

  runSolution(): void {
    this.consoleMessages = [];
    this.isRunning = true;
  
    // Сброс поля
    this.gs.setGameField({
      layout_array: [...this.initialGameField],
      width: this.width,
      height: this.height,
      id_game_field: this.fieldID,
      energy: this.maxCommands
    });
  
    const code = this.convertAlgorithmToString();
    const { done$, log$ } = this.ss.simulateFromString(code, 1000, this.fieldID);
  
    this.consoleMessages.push('▶ Запуск алгоритма...');
  
    // ✅ Подписка на лог и завершение
    log$.subscribe((msg: string) => this.consoleMessages.push(msg));
    done$.subscribe({
      complete: () => {
        this.consoleMessages.push('✅ Алгоритм успешно выполнен');
        this.isRunning = false;
      },
      error: (err: string) => {
        this.consoleMessages.push(`❌ Ошибка: ${err}`);
        this.isRunning = false;
      }
    });
  }

  stopSolution(): void {
    this.ss.stopSimulation();
    this.consoleMessages.push('⏹ Выполнение остановлено пользователем');
    this.isRunning = false;
  }
}
