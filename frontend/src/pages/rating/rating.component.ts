import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, lastValueFrom, of, timeout } from 'rxjs';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent {
  studentsForm: FormGroup;
  currentClass: string = "10A";
  studentsData: any[] = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
  ) {
    this.studentsForm = this.fb.group({
      students: this.fb.array([])
    })
  }

  async ngOnInit() {
    await this.loadStudents();
    await this.loadAllStudentsTasks();
    this.calculateRating();
  }

  get students(): FormArray {
    return this.studentsForm.get('students') as FormArray;
  }

  getStudentRatings(studentControl: AbstractControl): Array<any> {
    const ratingsControl = (studentControl as FormGroup).get('studentRatings');
    return ratingsControl ? ratingsControl.value : [];
  }

  async loadStudents(): Promise<void> {
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
      if (student.class_name == this.currentClass) {
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
      student[4] = Math.round(averageMark*10)/10;
      student[5] = student[2].length;
    });
  
    this.studentsData.sort((a, b) => b[4] - a[4]);
    
    let place = 1;
    this.studentsData.forEach(student => {
      this.students.push(
        this.fb.group({
          place: [place],
          name: [student[1]],
          homeworkCount: [student[5]],
          averageMark: [student[4]]
        })
      );
      place++;
    });
    console.log(this.studentsForm);
  }

  goToJournal() {
    console.log('hi')
    this.router.navigate(['/teacherjournal']);
  }
}
