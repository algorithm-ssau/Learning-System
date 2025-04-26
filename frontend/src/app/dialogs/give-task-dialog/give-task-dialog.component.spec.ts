import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiveTaskDialogComponent } from './give-task-dialog.component';

describe('GiveTaskDialogComponent', () => {
  let component: GiveTaskDialogComponent;
  let fixture: ComponentFixture<GiveTaskDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GiveTaskDialogComponent]
    });
    fixture = TestBed.createComponent(GiveTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
