import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-command-block',
  templateUrl: './command-block.component.html',
  styleUrls: ['./command-block.component.css']
})
export class CommandBlockComponent implements OnInit {
  @Input() parentArray!: FormArray;
  @Input() index!: number;
  @Input() getTotalCommandCount!: () => number;
  @Input() maxCommands!: number;
  @Input() control!: FormGroup;

  @Output() dragCommand = new EventEmitter<{ type: string, array: FormArray, index: number }>();
  @Output() dropCommand = new EventEmitter<{ index: number, array: FormArray }>();

  ngOnInit(): void {
    if (this.control.get('type')?.value === 'цикл') {
      const iterationsControl = this.control.get('iterations');
      if (iterationsControl && iterationsControl.validator == null) {
        iterationsControl.setValidators([Validators.required, Validators.min(2), Validators.max(10)]);
        iterationsControl.updateValueAndValidity();
      }
    }
  }

  onIterationsBlur() {
    const control = this.control.get('iterations');
    if (control) {
      const value = control.value;
      if (value < 2) control.setValue(2);
      else if (value > 10) control.setValue(10);
    }
  }

  get formGroup(): FormGroup {
    return this.control as FormGroup;
  }

  asFormArray(control: AbstractControl | null): FormArray {
    return control as FormArray;
  }

  asFormGroup(control: AbstractControl | null): FormGroup {
    return control as FormGroup;
  }

  onDragStart() {
    this.dragCommand.emit({
      type: this.control.get('type')?.value,
      array: this.parentArray,
      index: this.index
    });
  }

  onDrop(index: number, array: FormArray) {
    this.dropCommand.emit({ index, array });
  }

  isLastCommand(index: number, array: FormArray): boolean {
    return index === array.length - 1;
  }
}
