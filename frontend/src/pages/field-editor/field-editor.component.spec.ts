import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldEditorComponent } from './field-editor.component';

describe('FieldEditorComponent', () => {
  let component: FieldEditorComponent;
  let fixture: ComponentFixture<FieldEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FieldEditorComponent]
    });
    fixture = TestBed.createComponent(FieldEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
