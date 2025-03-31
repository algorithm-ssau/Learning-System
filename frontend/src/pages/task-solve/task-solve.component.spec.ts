import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskSolveComponent } from './task-solve.component';

describe('TaskSolveComponent', () => {
  let component: TaskSolveComponent;
  let fixture: ComponentFixture<TaskSolveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskSolveComponent]
    });
    fixture = TestBed.createComponent(TaskSolveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
