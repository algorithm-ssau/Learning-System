import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { EvaluationService } from 'src/services/evaluation.service';
import { Router } from '@angular/router';

interface CommandBlock {
  type: string;
  text: string;
  iterations?: number; // Число итераций цикла (2-10)
  commands?: CommandBlock[];
}

@Component({
  selector: 'app-task-solve',
  templateUrl: './task-solve.component.html',
  styleUrls: ['./task-solve.component.css']
})
export class TaskSolveComponent implements OnInit{
  algorithmForm: FormGroup;
  taskDescription: string = '';
  consoleMessages: string[] = [];
  maxCommands: number = 10;
  studentId!: number;
  taskId!: number;
  draggedCommand: string | null = null;

  constructor(
    private fb: FormBuilder,
    private evaluationService: EvaluationService,
    private router: Router
  ) {
    this.algorithmForm = this.fb.group({
      commands: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.evaluationService.getTaskDetails().subscribe(task => {
      this.taskDescription = task.description;
      this.maxCommands = task.maxCommands;
      this.taskId = task.taskId;
      this.studentId = task.studentId;
    });
  }

  get commands(): FormArray {
    return this.algorithmForm.get('commands') as FormArray;
  }

  goToJournal(): void {
    this.router.navigate(['/journal']);
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

  dragCommand(type: string): void {
    this.draggedCommand = type;
  }

  dropCommand(index: number, parentArray?: FormArray): void {
    if (!this.draggedCommand) return;
    
    if (parentArray) {
      parentArray.setControl(index, this.fb.group({
        type: new FormControl(this.draggedCommand),
        text: new FormControl(this.draggedCommand === 'цикл' ? 'цикл' : this.draggedCommand),
        iterations: new FormControl(this.draggedCommand === 'цикл' ? 2 : null),
        subCommands: this.fb.array([]) 
      }));
    } else {
      this.addCommand(this.draggedCommand);
    }
    
    this.draggedCommand = null;
  }

  convertAlgorithmToString(): string {
    let result: string[] = [];

    const processCommands = (commands: FormArray) => {
      commands.controls.forEach(command => {
        if (command.get('type')?.value === 'цикл') {
          let iterations = command.get('iterations')?.value || 2;
          result.push(`цикл ${iterations}`);
          processCommands(command.get('subCommands') as FormArray);
        } else {
          result.push(command.get('text')?.value);
        }
      });
    };

    processCommands(this.commands);
    return result.join('|');
  }

  submitSolution(): void {
    const solutionString = this.convertAlgorithmToString();
    
    this.evaluationService.submitSolution(this.studentId, this.taskId, solutionString)
      .subscribe(() => alert('Решение отправлено на проверку!'));
  }

  runSolution(): void {
    this.consoleMessages.push('Запуск алгоритма...');
  }
}
