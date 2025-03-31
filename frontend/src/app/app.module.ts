import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { GameStateService } from 'src/services/game-state.service';
import { AppComponent } from './app.component';
import { FieldEditorComponent } from 'src/pages/field-editor/field-editor.component';
import { TaskViewComponent } from 'src/pages/task-view/task-view.component';
import { TaskSolveComponent } from 'src/pages/task-solve/task-solve.component';

const roots: Routes = [
  {path: '', component: AppComponent}, // Заменить авторизацией
  {path: 'editor', component: FieldEditorComponent},
  {path: 'view', component: TaskViewComponent},
  {path: 'solve', component: TaskSolveComponent},
  {path: '**', component: AppComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    FieldEditorComponent,
    TaskViewComponent,
    TaskSolveComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(roots),
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    GameStateService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
