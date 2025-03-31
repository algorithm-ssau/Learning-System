import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}