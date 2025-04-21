import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { GameStateService } from 'src/services/game-state.service';
import { AppComponent } from './app.component';
import { FieldEditorComponent } from 'src/pages/field-editor/field-editor.component';
import { TaskViewComponent } from 'src/pages/task-view/task-view.component';
import { TaskSolveComponent } from 'src/pages/task-solve/task-solve.component';
import { TeacherJournalComponent } from '../pages/teacher-journal/teacher-journal.component';

const roots: Routes = [
  {path: '', component: AppComponent}, // Заменить авторизацией
  {path: 'editor', component: FieldEditorComponent},
  {path: 'view', component: TaskViewComponent},
  {path: 'solve', component: TaskSolveComponent},
  {path: 'teacherjournal', component: TeacherJournalComponent},
  {path: '**', component: AppComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    FieldEditorComponent,
    TaskViewComponent,
    TaskSolveComponent,
    TeacherJournalComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(roots),
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule, 
    FormsModule
  ],
  providers: [
    GameStateService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
