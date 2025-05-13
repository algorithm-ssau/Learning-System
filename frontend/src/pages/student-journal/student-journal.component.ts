import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, AbstractControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, lastValueFrom, of, timeout } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import { AuthService } from 'src/services/auth.service';
import { EvaluationService } from 'src/services/evaluation.service';

@Component({
  selector: 'app-student-journal',
  templateUrl: './student-journal.component.html',
  styleUrls: ['./student-journal.component.css']
})
export class StudentJournalComponent {
  ratingsForm: FormGroup;
  tasksForm: FormGroup;
  tasksData: any[] = [];
  studentsData: any[] = [];
  studentName: string = "Тестовый поц";
  studentClass: string = "10A";
  studentLogin: string = "student10A1";
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService,
    private es: EvaluationService
  ) {
    this.ratingsForm = this.fb.group({
      ratings: this.fb.array([])
    });
    this.tasksForm = this.fb.group({
      tasks: this.fb.array([])
    })
  }

  async ngOnInit() {
    this.authService.login$.subscribe(login => {
      if (login != null) {
        this.studentLogin = login;
      }
    })
    await this.loadStudent();
    await this.loadStudentTasks();
    await this.loadClassmates();
    await this.loadAllStudentsTasks();
    this.calculateRating();
  }

  get ratings(): FormArray {
    return this.ratingsForm.get('ratings') as FormArray;
  }

  get tasks(): FormArray {
    return this.tasksForm.get('tasks') as FormArray;
  }

  async loadStudent(): Promise<void> {
    try {
    const student = await lastValueFrom(
      this.apiService.getStudent(this.studentLogin).pipe(
        timeout(3000),
        catchError(error => {
          console.error("Student load failed", error);
          return of([]);
        })
      )
    );
    console.log(student, 'тест')
    this.studentName = student.name;
    this.studentClass = student.class_name;
    } catch (error) {
    console.error('Critical error when loading student', error);
    }
  }

  async loadStudentTasks(): Promise<void> {
    console.log('Starting task load', this.tasksForm);

    try {
      const tasks = await lastValueFrom(
        this.apiService.getStudentTasks(this.studentLogin).pipe(
          timeout(3000),
          catchError(error => {
            console.error(`Task load failed:`, error);
            return of([]);
          })
        )
      )
      let tasksArray = this.tasks;
      tasks.forEach(task => {
        tasksArray.push(this.fb.group({
          taskName: [task.task_name, Validators.required],
          taskMark: [task.task_mark, Validators.required],
          idTask: [task.id_task]
        }));
      });
    } catch (error) {
      this.tasksData = [];
      console.error(`Critical error when loading tasks`, error);
    }
    console.log('Final tasks data:', this.tasksForm);
  }

  async loadClassmates(): Promise<void> {
    try {
      const response = await lastValueFrom(
        this.apiService.getStudents().pipe(
          timeout(5000),
          catchError(error => {
            console.error('Classmates load error:', error);
            return of([]);
          })
        )
      );
      response.forEach((student: { login: any; name: any; surname: any; patronymic: any; class_name: any;}) => {
      if (student.class_name == this.studentClass) {
        this.studentsData.push([
          student.login,
          `${student.name} ${student.surname} ${student.patronymic}`.trim(),
          [],
          student.class_name,
        ]);
      }});
      console.log('Classmates loaded:', this.studentsData);
    } catch (error) {
      console.error('Failed to load classmates:', error);
      this.studentsData = [];
    }
  }

  async loadAllStudentsTasks(): Promise<void> {
    try {
      for (const student of this.studentsData) {
        const login = student[0];
        try {
          const tasks = await lastValueFrom(
            this.apiService.getStudentTasks(login).pipe(
              timeout(3000),
              catchError(error => {
                console.error(`Task load failed for ${login}:`, error);
                return of([]);
              })
            )
          );
          student[2] = tasks.map(task => task.task_mark).filter(mark => mark >= 2);
        } catch (error) {
          student[2] = 0;
          console.error(`Critical error for ${login}:`, error);
        }
      }
      
      console.log('Final student data:', this.studentsData);
    } catch (error) {
      console.error('Global task load error:', error);
    }
  }

  calculateRating() {
    this.studentsData.forEach(student => {
      const averageMark = student[2]?.length ? student[2].reduce((a: any, b: any) => a + b, 0) / student[2].length : 0;
      student[4] = averageMark;
      student[5] = student[2].length;
    });
  
    this.studentsData.sort((a, b) => b[4] - a[4]);
  
    const place = this.studentsData.findIndex(student => student[0] === this.studentLogin) + 1;
    const studentData = this.studentsData[place - 1];
  
    this.ratings.clear();
    this.ratings.push(this.fb.control(place));
    this.ratings.push(this.fb.control(studentData[5]));
    this.ratings.push(this.fb.control(studentData[4]));
    console.log(this.ratingsForm);
  }

  SolveTask(student_login: string, id_task: number) {
    this.es.setCurrentEvaluation(student_login, id_task);
    this.router.navigate(['/solve']);
  }

  goToRating(): void {
    this.router.navigate(['/rating']);
  }
  goToSystemInfo(): void {
    this.router.navigate(['/systeminfo']);
  }
  goToDeveloperInfo(): void {
    this.router.navigate(['/developerinfo'])
  }
  Exit(): void {
    this.authService.logout();
    this.router.navigate([''])
  }

}
