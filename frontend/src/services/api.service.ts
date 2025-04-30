import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Student, StudentTask } from 'src/app/models/model';

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

    getAllTasks(): Observable<any> {
        return this.http.get(`${this.apiUrl}/tasks/`)
    }

    postStudent(student: Student): Observable<any> {
        return this.http.post(`${this.apiUrl}/students`, student)
    }

    giveTask(studentTask: StudentTask): Observable<any> {
        return this.http.post(`${this.apiUrl}/`)
    }
}