import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherJournalComponent } from './teacher-journal.component';

describe('TeacherJournalComponent', () => {
  let component: TeacherJournalComponent;
  let fixture: ComponentFixture<TeacherJournalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeacherJournalComponent]
    });
    fixture = TestBed.createComponent(TeacherJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
