import { Component, OnInit } from '@angular/core';
import { EvaluationService } from 'src/services/evaluation.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, AbstractControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-teacher-journal',
  templateUrl: './teacher-journal.component.html',
  styleUrls: ['./teacher-journal.component.css']
})
export class TeacherJournalComponent implements OnInit{
  classesForm: FormGroup;
  studentsForm: FormGroup;
  newClassName: string = '';
  isMenuOpen = false;
  constructor(
    private fb: FormBuilder, 
    private evaluationService: EvaluationService,
    private router: Router
    ) {
    this.classesForm = this.fb.group({
      classes: this.fb.array([
        this.createClass('5В', 25),
        this.createClass('6Г', 18),
        this.createClass('7Д', 18),
        this.createClass('6Г', 18),
        this.createClass('6Г', 18),
        this.createClass('6Г', 18),
        this.createClass('6Г', 18),
        this.createClass('6Г', 18),
        this.createClass('6Г', 18),
        this.createClass('6Г', 18),
        this.createClass('6Г', 18),
        this.createClass('6Г', 18),
        this.createClass('end', 18),
      ])
    });
    this.studentsForm = this.fb.group({
      students: this.fb.array([
        this.createStudent(
          'Коля',
          [
            ['1 задание', 5],
            ['2 задание', 0],
            ['3 задание', 1],
            ['4 задание', 0],
          ]),
        this.createStudent(
          'Коля',
          [
            ['1 задание', 5],
            ['2 задание', 0],
            ['3 задание', 1],
            ['4 задание', 0],
          ]),
        this.createStudent(
          'Коля',
          [
            ['1 задание', 5],
            ['2 задание', 0],
            ['3 задание', 1],
            ['4 задание', 0],
          ]),
        this.createStudent(
          'Коля',
          [
            ['ну оч длиннющее задание такое длинное что прям капец блин', 5],
            ['2 задание', 0],
            ['3 задание', 1],
            ['4 задание', 0],
            ['5 задание', 2],
            ['3 задание', 1],
            ['4 задание', 0],
            ['5 задание', 2],
            ['6 задание', 4],
            ['7 задание', 1],
            ['8 задание', 3],
            ['задание крч', 1],
            ['ня', 5],
            ['мур-мур', 2],
            [':3', 5],
          ]),
        this.createStudent(
          'Коля',
          [
            ['1 задание', 5],
            ['2 задание', 0],
            ['3 задание', 1],
            ['4 задание', 0],
            ['5 задание', 2],
            ['6 задание', 4],
            ['7 задание', 1],
            ['8 задание', 3],
            ['задание крч', 1],
            ['ня', 5],
            ['мур-мур', 2],
            [':3', 5],
          ]),
        this.createStudent(
          'Коля',
          [
            ['1 задание', 5],
            ['2 задание', 0],
            ['3 задание', 1],
            ['4 задание', 0],
            ['5 задание', 2],
            ['6 задание', 4],
            ['7 задание', 1],
            ['8 задание', 3],
            ['задание крч', 1],
            ['ня', 5],
            ['мур-мур', 2],
            [':3', 5],
          ]),
        this.createStudent(
          'Вова',
          [
            ['1 задание', 5],
            ['2 задание', 0],
            ['3 задание', 1],
            ['4 задание', 0],
            ['5 задание', 2],
            ['6 задание', 4],
            ['7 задание', 1],
            ['8 задание', 3],
            ['задание крч', 1],
            ['ня', 5],
            ['мур-мур', 2],
            [':3', 5],
          ]),
      ])
    })
  }
  ngOnInit(): void {
    this.evaluationService.getTaskDetails().subscribe(task => {
      console.log('Form Structure:', this.classesForm.value);
      console.log('Controls:', this.classes.controls.length);
    });
  }
  // Helper method to create a form group for each class entry
  private createClass(className: string, studentCount: number): FormGroup {
    return this.fb.group({
      className: [className, [Validators.required, Validators.maxLength(3)]],
      studentCount: [studentCount, [Validators.required, Validators.min(1), Validators.max(50)]]
    });
  }
  private createStudent(studentName: string, studentTasks: [string, number][]): FormGroup {
    return this.fb.group({
      studentName: [studentName, [Validators.required, Validators.maxLength(20)]],
      studentTasks: this.fb.array(
        studentTasks.map(task => this.fb.control(task)),
        [Validators.required, Validators.maxLength(30)]
      )
    });
  }
  // Getter for easy access to the form array
  get classes(): FormArray {
    return this.classesForm.get('classes') as FormArray;
  }
  get students(): FormArray {
    return this.studentsForm.get('students') as FormArray;
  }
  getStudentTasks(student: AbstractControl): FormArray {
    return student.get('studentTasks') as FormArray;
  }
  // Add a new empty class entry
  addClass() {
    if (this.newClassName.trim()) {
      this.classes.push(this.fb.group({
        className: [this.newClassName.trim()],
        studentCount: [0] // Default student count
      }));
      this.newClassName = ''; // Clear input
    }
  }
  addStudent() {}
  someAction() {
  this.isMenuOpen = false;
  // Add your button actions here
  console.log('Button clicked!');
}
  removeClass(index: number): void {
    this.classes.removeAt(index);
  }
  goToRating(): void {
    this.router.navigate(['/rating']);
  }
  // Submit the form
  onSubmit(): void {
    if (this.classesForm.valid) {
      console.log('Form submitted:', this.classesForm.value);
      // Here you would typically send data to a service
    } else {
      console.log('Form is invalid');
    }
  }
}