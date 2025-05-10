import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { GameField } from './game-state.service';
import { GameStateService } from './game-state.service';

export interface Task {
  id_task?: number;
  name: string;
  id_game_field: number;
  id_goal: number;
}

interface Solution {
  student_login: string;
  id_task: number;
  algorithm: string;
}

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {

  private apiUrl = 'http://localhost:8000'

  constructor(private http: HttpClient, private gs: GameStateService) {}

  submitRating(rating: number): Observable<any> {
    return this.http.post('/api/rating', { rating });
  }

  getTaskDetails(id_task: number, student_login: string): Observable<[Task, GameField]> {
    return forkJoin([
      this.getTask(id_task)
    ]).pipe(
      switchMap(([task]) => {
        return this.gs.getGameField(task.id_game_field).pipe(
          map(gameField => [task, gameField] as [Task, GameField])
        );
      })
    );
  }

  getTask(id_task: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/tasks/${id_task}`);
  }
  
  getSolution(taskId: number, studentId: string): Observable<Solution> {
    return this.http.get<Solution>(`${this.apiUrl}/solutions/${studentId}/${taskId}`);
  }

  submitSolution(studentId: string, taskId: number, solution: string): Observable<Solution> {
    const submission: Solution = {
      student_login: studentId,
      id_task: taskId,
      algorithm: solution
    };

    return this.http.post<Solution>(`${this.apiUrl}/solutions/${studentId}/${taskId}`, submission);
  }
}