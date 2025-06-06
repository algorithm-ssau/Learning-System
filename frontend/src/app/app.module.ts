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
import { RatingComponent } from '../pages/rating/rating.component';
import { NotFoundErrorComponent } from '../pages/not-found-error/not-found-error.component';
import { StudentJournalComponent } from '../pages/student-journal/student-journal.component';
import { AuthorizationComponent } from '../pages/authorization/authorization.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { SystemInfoTeacherComponent } from '../pages/system-info-teacher/system-info-teacher.component';


const roots: Routes = [
  {path: '', component: AuthorizationComponent},
  {path: 'editor', component: FieldEditorComponent},
  {path: 'view', component: TaskViewComponent},
  {path: 'solve', component: TaskSolveComponent},
  {path: 'teacherjournal', component: TeacherJournalComponent},
  {path: 'studentjournal', component: StudentJournalComponent},
  {path: 'developerinfo', component: DeveloperInfoComponent},
  {path: 'systeminfo', component: SystemInfoComponent},
  {path: 'systeminfoteacher', component: SystemInfoTeacherComponent},
  {path: 'rating', component: RatingComponent},
  {path: '**', component: NotFoundErrorComponent},
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
    CommandBlockComponent,
    RatingComponent,
    NotFoundErrorComponent,
    StudentJournalComponent,
    AuthorizationComponent,
    SystemInfoTeacherComponent
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
    EvaluationService,
    SimulationService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
