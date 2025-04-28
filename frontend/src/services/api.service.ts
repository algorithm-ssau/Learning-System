import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = 'http://localhost:8000';

    constructor(private http: HttpClient) {}

    getClasses(): Observable<any> {
        return this.http.get(`${this.apiUrl}/classes`)
    }

    getStudents(): Observable<any> {
        return this.http.get(`${this.apiUrl}/students`);
    }

    getStudentTasks(login: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/students/${login}/tasks`)
    }

    getStudent(login: string): Observable<any> {
        return this.http.get('$(this.apiUrl}/students/${login}');
    }

    createStudent(student: any): Observable<any> {
        return this.http.post('${this.apiUrl}/students/', student);
    }

    getTasks(): Observable<any> {
        return this.http.get('${this.apiUrl}/tasks/');
    }

    getTask(id: number): Observable<any> {
        return this.http.get('${this.apiUrl}/tasks/${id}');
    }
}