import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Student, Journal, StudentTask } from 'src/app/models/model';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getClasses(): Observable<any> {
        return this.http.get(`${this.apiUrl}/classes`)
    }

    getStudents(): Observable<any> {
        return this.http.get(`${this.apiUrl}/students`);
    }

    getStudent(login: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/students/${login}`)
    }

    getStudentTasks(login: string): Observable<StudentTask[]> {
        return this.http.get<StudentTask[]>(`${this.apiUrl}/students/${login}/tasks`)
    }

    getAllTasks(): Observable<any> {
        return this.http.get(`${this.apiUrl}/tasks/`)
    }

    postStudent(student: Student): Observable<any> {
        return this.http.post(`${this.apiUrl}/students`, student)
    }

    giveTask(journal: Journal): Observable<any> {
        return this.http.post(`${this.apiUrl}/journal`, journal)
    }

    deleteStudentTask(studentLogin: string, taskId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/journal/${studentLogin}/${taskId}`);
    }
}