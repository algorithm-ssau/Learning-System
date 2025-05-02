import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentJournalComponent } from './student-journal.component';

describe('StudentJournalComponent', () => {
  let component: StudentJournalComponent;
  let fixture: ComponentFixture<StudentJournalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentJournalComponent]
    });
    fixture = TestBed.createComponent(StudentJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
