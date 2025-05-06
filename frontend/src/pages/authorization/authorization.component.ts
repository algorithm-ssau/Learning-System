import { Component } from '@angular/core';
import { AuthService } from 'src/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css']
})
export class AuthorizationComponent {
  userData = {
    username: "",
    password: "",
  }

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    this.authService.login({ username: this.userData.username, password: this.userData.password }).subscribe({
      next: (response) => {
        console.log('Logged in successfully', response);
        if (response.access_token){
          if (response.role == "teacher") {
            this.router.navigate(['/teacherjournal'])
          } else {
            this.router.navigate(['/studentjournal'])
          }
        }
      },
      error: (err) => {
        console.error('Login failed', err);
      }
    })
  }
}
