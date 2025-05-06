import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EvaluationService } from 'src/services/evaluation.service';
import { Router } from '@angular/router';
import { GameElement, GameStateService } from 'src/services/game-state.service';
import { SimulationService } from 'src/services/simulation.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css']
})
export class TaskViewComponent implements OnInit{
  taskID: number = 1;
  studentID: string = '';
  fieldID: number = 1;
  taskText: string = '';
  commandLimit: number = 0;
  algorithmForm: FormGroup;
  parsedAlgorithm: string = '';
  width = 10;
  height = 10;
  gameGrid: number[] = Array(this.width * this.height).fill(0);
  executionLogs: string[] = [];
  isRunning = false;
  
  ratings: number[] = [1, 2, 3, 4, 5];

  ratingForm = new FormGroup({
    selectedRating: new FormControl(1)
  });

  constructor(
    private fb: FormBuilder,
    private evaluationService: EvaluationService,
    private gs: GameStateService,
    private ss: SimulationService,
    private router: Router) {
      this.algorithmForm = this.fb.group({
        commands: this.fb.array([])
      });
  }

  ngOnInit(): void {
    this.evaluationService.getTaskDetails(this.taskID, this.studentID).subscribe(task => {
      this.taskText = task[0].goal;
      this.gameGrid = [... task[2].gameField];
      this.parsedAlgorithm = task[1].algorithm;
      this.fieldID = task[2].fieldID;
    });
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

  get commands(): FormArray {
    return this.algorithmForm.get('commands') as FormArray;
  }

  asFormGroup(control: AbstractControl | null): FormGroup {
    return control as FormGroup;
  }

  parseAlgorithm(algorithm: string): any[] {
    let commands = algorithm.split('|');
    let parsed = [];
    let i = 0;

    while (i < commands.length) {
      let command = commands[i];

      if (command.startsWith('цикл')) {
        let parts = command.split(' ');
        let iterations = parseInt(parts[1], 10);
        let subcommands = [];

        for (let j = 0; j < iterations && i + 1 < commands.length; j++) {
          i++;
          subcommands.push(commands[i]);
        }

        parsed.push({ type: 'loop', text: command, commands: subcommands });
      } else {
        parsed.push({ type: 'move', text: command });
      }

      i++;
    }

    return parsed;
  }

  isLastCommand(index: number, array: FormArray): boolean {
    return index === array.length - 1;
  }

  goToJournal(): void {
    this.router.navigate(['/teacherjournal']);
  }

  submitRating(): void {
    const rating = this.ratingForm.value.selectedRating ?? 1; // Устанавливаем значение по умолчанию
    if (rating < 1 || rating > 5) {
      alert('Выберите корректную оценку!');
      return;
    }
    this.evaluationService.submitRating(rating).subscribe(() => {
      alert('Оценка выставлена!');
    });
  }

  executeAlgorithm(): void {
    this.executionLogs.push('Выполнение алгоритма...');
  }

  get gridStyle() {
    return {
      'grid-template-columns': `repeat(${this.width}, 60px)`,
      'grid-template-rows': `repeat(${this.height}, 60px)`
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

  runSolution(): void {
    this.executionLogs = [];
    this.isRunning = true;
  
    const { done$, log$ } = this.ss.simulateFromString(this.parsedAlgorithm, 500, this.fieldID);
  
    // Подписка на поток логов
    log$.subscribe((msg: string) => {
      this.executionLogs.push(msg);
    });
  
    // Подписка на завершение
    done$.subscribe({
      complete: () => {
        this.executionLogs.push('✅ Алгоритм успешно выполнен');
        this.isRunning = false;
      },
      error: (err: string) => {
        this.executionLogs.push(`❌ Ошибка: ${err}`);
        this.isRunning = false;
      }
    });
    console.log("Я работаю!");
  }
}
