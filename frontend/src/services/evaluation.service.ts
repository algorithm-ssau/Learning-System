import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface TaskData {
  taskId: number;
  studentId: number;
  description: string;
  maxCommands: number;
}

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  constructor(private http: HttpClient) {}

  getEvaluationData(): Observable<any> {
    return this.http.get('/api/evaluation');
  }

  submitRating(rating: number): Observable<any> {
    return this.http.post('/api/rating', { rating });
  }

  getTaskDetails(): Observable<TaskData> {
    return this.http.get<TaskData>('/api/evaluation');
  }

  submitSolution(studentId: number, taskId: number, solution: string): Observable<any> {
    const submission = {
      studentId,
      taskId,
      solution
    };

    return this.http.post('/api/evaluation', submission);
  }
}