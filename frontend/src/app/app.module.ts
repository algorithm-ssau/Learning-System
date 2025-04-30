import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { GameStateService } from 'src/services/game-state.service';
import { AppComponent } from './app.component';
import { FieldEditorComponent } from 'src/pages/field-editor/field-editor.component';
import { TaskViewComponent } from 'src/pages/task-view/task-view.component';
import { TaskSolveComponent } from 'src/pages/task-solve/task-solve.component';
import { TeacherJournalComponent } from '../pages/teacher-journal/teacher-journal.component';
import { DeveloperInfoComponent } from 'src/pages/developer-info/developer-info.component';
import { SystemInfoComponent } from 'src/pages/system-info/system-info.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddStudentDialogComponent } from './dialogs/add-student-dialog/add-student-dialog.component';
import { GiveTaskDialogComponent } from './dialogs/give-task-dialog/give-task-dialog.component';
import { DeleteTaskDialogComponent } from './dialogs/delete-task-dialog/delete-task-dialog.component';
import { AddTaskDialogComponent } from './dialogs/add-task-dialog/add-task-dialog.component';
import { ViewTasksDialogComponent } from './dialogs/view-tasks-dialog/view-tasks-dialog.component';
import { CommandBlockComponent } from '../pages/command-block/command-block.component';
import { EvaluationService } from 'src/services/evaluation.service';
import { SimulationService } from 'src/services/simulation.service';


const roots: Routes = [
  {path: '', component: AppComponent}, // Заменить авторизацией
  {path: 'editor', component: FieldEditorComponent},
  {path: 'view', component: TaskViewComponent},
  {path: 'solve', component: TaskSolveComponent},
  {path: 'teacherjournal', component: TeacherJournalComponent},
  {path: 'developerinfo', component: DeveloperInfoComponent},
  {path: 'systeminfo', component: SystemInfoComponent},
  {path: '**', component: AppComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    FieldEditorComponent,
    TaskViewComponent,
    TaskSolveComponent,
    TeacherJournalComponent,
    AddStudentDialogComponent,
    GiveTaskDialogComponent,
    AddTaskDialogComponent,
    DeleteTaskDialogComponent,
    ViewTasksDialogComponent,
    DeveloperInfoComponent,
    SystemInfoComponent,
    CommandBlockComponent
  ],
  imports: [
    BrowserModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    OverlayModule,
    RouterModule.forRoot(roots),
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [
    GameStateService,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
