import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8000';
    private loginSubject = new BehaviorSubject<string | null>(null);  
    login$ = this.loginSubject.asObservable();
    accessTokenSubject = new BehaviorSubject<string | null>(null);
    accessToken$ = this.accessTokenSubject.asObservable();

    constructor(private http: HttpClient) {}

    login(credentials: { username: string; password: string }) {
        return this.http.post<{ access_token: string, role: string}>(`${this.apiUrl}/login`, credentials, { withCredentials: true }).pipe(
            tap(res => {
                this.accessTokenSubject.next(res.access_token),
                this.loginSubject.next(credentials.username);})
        );
    }

    refreshToken() {
        return this.http.post<{access_token: string }>(`${this.apiUrl}/refresh`, {}, { withCredentials: true }).pipe(
            tap(res => this.accessTokenSubject.next(res.access_token))
        );
    }

    logout() {
        return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
            tap(() => {
                this.accessTokenSubject.next(null),
                this.loginSubject.next(null);
            })
        );
    }
}
