import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { GameField } from './game-state.service';
import { GameStateService } from './game-state.service';

export interface Task {
  id_task?: number;
  name: string;
  gameFieldID: number;
  goal: number;
}

interface Solution {
  solutionID: number;
  studentID: string;
  taskID: number;
  algorithm: string;
}

interface SolveTask {
  taskID: number;
  studentID: string;
  mark: number;
}

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  constructor(private http: HttpClient, private gs: GameStateService) {}

  getEvaluationData(): Observable<any> {
    return this.http.get('/api/evaluation');
  }

  submitRating(rating: number): Observable<any> {
    return this.http.post('/api/rating', { rating });
  }

  getTaskDetails(taskId: number, studentID: string): Observable<[Task, Solution, GameField]> {
    return forkJoin([
      this.getTask(taskId),
      this.getSolution(taskId, studentID)
    ]).pipe(
      switchMap(([task, solution]) => {
        return this.gs.getGameField(task.gameFieldID).pipe(
          map(gameField => [task, solution, gameField] as [Task, Solution, GameField])
        );
      })
    );
  }

  getTask(taskId: number): Observable<Task> {
    const params = new HttpParams().set('taskId', taskId.toString());
    return this.http.get<Task>('/api/task', { params });
  }
  
  getSolution(taskId: number, studentID: string): Observable<Solution> {
    const params = new HttpParams()
      .set('taskId', taskId.toString())
      .set('studentID', studentID);
    return this.http.get<Solution>('/api/solution', { params });
  }

  submitSolution(studentId: string, taskId: number, solution: string): Observable<any> {
    const submission = {
      studentId,
      taskId,
      solution
    };

    return this.http.post('/api/evaluation', submission);
  }
}