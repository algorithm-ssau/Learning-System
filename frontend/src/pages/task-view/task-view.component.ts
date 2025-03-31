import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EvaluationService } from 'src/services/evaluation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css']
})
export class TaskViewComponent implements OnInit{
  taskText: string = '';
  commandLimit: number = 0;
  commandCount: number = 0;
  parsedAlgorithm: any[] = [];
  gameGrid: string[][] = [];
  executionLogs: string[] = [];
  
  ratings: number[] = [1, 2, 3, 4, 5];

  ratingForm = new FormGroup({
    selectedRating: new FormControl(1)
  });

  constructor(private evaluationService: EvaluationService, private router: Router) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.evaluationService.getEvaluationData().subscribe(data => {
      this.taskText = data.taskText;
      this.commandLimit = data.commandLimit;
      this.parsedAlgorithm = this.parseAlgorithm(data.algorithm);
      this.commandCount = this.countCommands(data.algorithm);
      this.gameGrid = data.gameGrid;
    });
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

  countCommands(algorithm: string): number {
    return algorithm.split('|').filter(cmd => !cmd.startsWith('цикл')).length;
  }

  goToJournal(): void {
    this.router.navigate(['/journal']);
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
}
