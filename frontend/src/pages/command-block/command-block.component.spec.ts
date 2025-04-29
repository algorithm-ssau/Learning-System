import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandBlockComponent } from './command-block.component';

describe('CommandBlockComponent', () => {
  let component: CommandBlockComponent;
  let fixture: ComponentFixture<CommandBlockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommandBlockComponent]
    });
    fixture = TestBed.createComponent(CommandBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
