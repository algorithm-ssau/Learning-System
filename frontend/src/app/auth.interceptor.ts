import { Injectable } from '@angular/core';
import {
    HttpRequest, 
    HttpHandler,
    HttpEvent,
    HttpErrorResponse,
    HttpInterceptor
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private isRefreshing = false;

    constructor(private auth: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const accessToken = this.auth.accessTokenSubject.value;

        if (accessToken) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
        }

        return next.handle(request).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    return this.handle401Error(request, next);
                }
                return throwError(() => error);
            })
        );
    }
    
    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            return this.auth.refreshToken().pipe(
                switchMap(() => {
                    this.isRefreshing = false;
                    return next.handle(this.addTokenHeader(request));
                }),
                catchError(err => {
                    this.isRefreshing = false;
                    return throwError(() => err);
                })
            );
        }
        return next.handle(request);
    }

    private addTokenHeader(request: HttpRequest<any>) {
        const token = this.auth.accessTokenSubject.value;
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }
}