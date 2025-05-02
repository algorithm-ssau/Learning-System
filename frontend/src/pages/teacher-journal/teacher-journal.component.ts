import { Component, OnInit } from '@angular/core';
import { DialogService } from 'src/services/dialog.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, AbstractControl, Validators } from '@angular/forms';
import { ApiService } from 'src/services/api.service';
import { catchError, lastValueFrom, of, timeout } from 'rxjs';
import { Journal } from 'src/app/models/model';

@Component({
  selector: 'app-teacher-journal',
  templateUrl: './teacher-journal.component.html',
  styleUrls: ['./teacher-journal.component.css']
})
export class TeacherJournalComponent implements OnInit{
  classesForm: FormGroup;
  studentsForm: FormGroup;
  selectedClass: string = '';
  selectedClassIndex: number | null = null;
  newClassName: string = '';
  studentsData: any[] = [];
  classesData: any[] = [];
  tasksData: any[] = [];
  constructor(
    private fb: FormBuilder, 

    private router: Router,
    private dialogService: DialogService,
    private apiService: ApiService,
    ) {
    this.classesForm = this.fb.group({
      classes: this.fb.array([])
    });
    this.studentsForm = this.fb.group({
      students: this.fb.array([])
    })
  }
  async ngOnInit() {
    await this.loadClasses();
    await this.loadStudents();
    await this.loadAllStudentsTasks();
    await this.loadAllTasks();
    this.showClasses();
    const classesArray = this.classesForm.get('classes') as FormArray;
    this.selectedClass = classesArray.length > 0 
      ? classesArray.at(0).get('className')?.value || ''
      : '';
    if (this.classes.length > 0) {
      const firstClass = this.classes.at(0);
      this.selectClass(firstClass.get('className')?.value, 0);
    }
    this.showStudents();
  }

  private createClass(className: string, studentCount: number): FormGroup {
    return this.fb.group({
      className: [className, [Validators.required, Validators.maxLength(3)]],
      studentCount: [studentCount, [Validators.required, Validators.min(1), Validators.max(50)]]
    });
  }

  private createStudent(studentName: string, studentTasks: { task_name: string; task_mark: number ; id_task: number}[]): FormGroup {
    return this.fb.group({
      studentName: [studentName, [Validators.required, Validators.maxLength(20)]],
      studentTasks: this.fb.array(
        studentTasks.map(task => 
          this.fb.group({
            taskName: [task.task_name, Validators.required],
            taskMark: [task.task_mark, [Validators.required, Validators.min(-1), Validators.max(5)]],
            idTask: [task.id_task],
          })
        ),
        [Validators.required]
      )
    });
  }

  showClasses(){
    this.classesForm = this.fb.group({
      classes: this.fb.array([])
    });
    const classes = this.classesForm.get('classes') as FormArray
    for (const student_class of this.classesData){
      classes.push(this.createClass(student_class[0], student_class[1]))
    }
  }

  showStudents(){
    this.studentsForm = this.fb.group({
      students: this.fb.array([])
    })
    const students = this.studentsForm.get('students') as FormArray
    for (const student of this.studentsData){
      if (student[3] == this.selectedClass){
        students.push(this.createStudent(student[1], student[2]))
      }
    }
  }

  selectClass(className: string, index: number): void {
    this.selectedClass = className;
    this.selectedClassIndex = index;
    this.showStudents(); 
  }

  isClassSelected(index: number): boolean {
    return this.selectedClassIndex === index;
  }

  get classes(): FormArray {
    return this.classesForm.get('classes') as FormArray;
  }
  get students(): FormArray {
    return this.studentsForm.get('students') as FormArray;
  }
  getStudentTasks(student: AbstractControl): FormArray {
    return student.get('studentTasks') as FormArray;
  }

  addClass() {
    if (this.newClassName.trim()) {
      this.classes.push(this.fb.group({
        className: [this.newClassName.trim()],
        studentCount: [0]
      }));
      this.newClassName = '';
    }
  }

  removeClass(index: number): void {
    this.classes.removeAt(index);
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
    this.router.navigate([''])
  }
  onSubmit(): void {
    if (this.classesForm.valid) {
      console.log('Form submitted:', this.classesForm.value);
    } else {
      console.log('Form is invalid');
    }
  }

  openAddStudent() {
    const dialogRef = this.dialogService.openAddStudentDialog();
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const students = this.studentsForm.get('students') as FormArray;
        students.push(this.createStudent(result.name, []))
        this.studentsData.push([result.login, result.name, [], this.selectedClass])
        this.increaseClassStudentCount(this.selectedClass);
        const student = {
          login: result.login, 
          name: result.name.split(" ")[0], 
          surname: result.name.split(" ")[1], 
          patronymic: result.name.split(" ")[2], 
          class_name: this.selectedClass,
          password: result.password,
        }
        const response = lastValueFrom(
          this.apiService.postStudent(student).pipe(
            timeout(5000),
            catchError(error => {
              console.error('Couldn\'t post student', error);
              return of([]);
            })
          )
        )
        console.log('Added student: ', result);
      }
    })
  }

  private increaseClassStudentCount(className: string): void {
    const classesArray = this.classesForm.get('classes') as FormArray;
    
    for (let i = 0; i < classesArray.length; i++) {
      const classGroup = classesArray.at(i) as FormGroup;
      if (classGroup.get('className')?.value === className) {
        const currentCount = classGroup.get('studentCount')?.value || 0;
        classGroup.get('studentCount')?.setValue(currentCount + 1);
        break;
      }
    }
  }

  openGiveTask() {
    const dialogRef = this.dialogService.openGiveTaskDialog({
      selectedClass: this.selectedClass,
      tasksData: this.tasksData,
      studentsData: this.studentsData.filter(s => s[3] === this.selectedClass)
    })
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let taskData = {taskName: '', taskMark: -1};
        for (const task of this.tasksData) {
          if (task.id_task == +result.taskId) {
            taskData = {taskName: task.name, taskMark: -1}
          }
        }
        this.studentsData.forEach( (student) => {
          if (student[3] == this.selectedClass && result.studentId == "all" || result.studentId == student[0]){
          student[2].push({task_name: taskData.taskName, task_mark: taskData.taskMark})
          const journal: Journal = {mark: -1, student_login: student[0], id_task: +result.taskId}
          const response = lastValueFrom(  
            this.apiService.giveTask(journal).pipe(
              timeout(5000),
              catchError(error => {
                console.error('Couldn\'t give task to a student:', error);
                return of([])
              })
            )
            )
          }
        })
        console.log('Gave task to student or students')
        this.showStudents();
      }
    })
  }

  openAddTask() {
    this.dialogService.openAddTaskDialog();
  }

  openViewTasks() {
    this.dialogService.openViewTaskDialog();
  }

  async loadClasses(): Promise<void> {
    try {
      const response = await lastValueFrom(
        this.apiService.getClasses().pipe(
          timeout(5000),
          catchError(error => {
            console.error('Classes load error:', error);
            return of([]);
          })
        )
      );
      this.classesData = response.map((student_class: { class_name: any; student_count: any; }) => [
        student_class.class_name,
        student_class.student_count
      ]);
      console.log('Classes loaded:', this.classesData);
    } catch (error) {
      console.error('Failed to load classes:', error);
      this.classesData = [];
    }
  }

  async loadStudents(): Promise<void> {
    try {
      const response = await lastValueFrom(
        this.apiService.getStudents().pipe(
          timeout(5000),
          catchError(error => {
            console.error('Student load error:', error);
            return of([]);
          })
        )
      );
      this.studentsData = response.map((student: { login: any; name: any; surname: any; patronymic: any; class_name: any;}) => [
        student.login,
        `${student.name} ${student.surname} ${student.patronymic}`.trim(),
        [],
        student.class_name,
      ]);
      
      console.log('Students loaded:', this.studentsData);
    } catch (error) {
      console.error('Failed to load students:', error);
      this.studentsData = [];
    }
  }
  
  async loadAllTasks(): Promise<void> {
    try {
    const tasks = await lastValueFrom(
      this.apiService.getAllTasks().pipe(
        timeout(5000),
      ))
    this.tasksData = tasks;
    console.log('All tasks loaded:', this.tasksData);
    } catch (error) {
      console.error(`Critical error when loading all tasks:`, error);
    }
  }

  async loadAllStudentsTasks(): Promise<void> {
    console.log('Starting task load', this.studentsData);
    
    if (!this.studentsData.length) {
      console.warn('No students to load tasks for');
      return;
    }
  
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
          student[2] = tasks;
        } catch (error) {
          student[2] = [];
          console.error(`Critical error for ${login}:`, error);
        }
      }
      
      console.log('Final student data:', this.studentsData);
    } catch (error) {
      console.error('Global task load error:', error);
    }
  }
  async deleteStudentTask(studentIndex: number, taskIndex: number, event: Event) {
    event.stopPropagation();

    const student = this.students.at(studentIndex);
    const studentLogin = this.studentsData[studentIndex][0];
    const tasksArray = student.get('studentTasks') as FormArray;
    const taskId = tasksArray.at(taskIndex).get('idTask')?.value;

    try {
      tasksArray.removeAt(taskIndex);

      await lastValueFrom(
        this.apiService.deleteStudentTask(studentLogin, taskId).pipe(
          timeout(5000),
          catchError(error => {
            console.error('Delete failed:', error);
            return of(null);
          })
        )
      )
      console.log('Task deleted from student successfully');
    } catch (error) {
      console.error('Error deleting task from student:', error);
    }
    
  }
}