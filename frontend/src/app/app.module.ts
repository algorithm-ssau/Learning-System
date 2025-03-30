import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { GameStateService } from 'src/services/game-state.service';
import { AppComponent } from './app.component';
import { FieldEditorComponent } from 'src/pages/field-editor/field-editor.component';

const roots: Routes = [
  {path: '', component: AppComponent}, // Заменить авторизацией
  {path: 'editor', component: FieldEditorComponent},
  {path: '**', component: AppComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    FieldEditorComponent
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
