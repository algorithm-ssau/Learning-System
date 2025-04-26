import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTasksDialogComponent } from './view-tasks-dialog.component';

describe('ViewTasksDialogComponent', () => {
  let component: ViewTasksDialogComponent;
  let fixture: ComponentFixture<ViewTasksDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewTasksDialogComponent]
    });
    fixture = TestBed.createComponent(ViewTasksDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
