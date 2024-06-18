import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlashcardsComponent } from './pages/flashcards/flashcards.component';
import { PreguntasFlashcardsComponent } from './pages/preguntas-flashcards/preguntas-flashcards.component';
import { StudyFlashcardsComponent } from './pages/study-flashcards/study-flashcards.component';

const routes: Routes = [
  {
    path: 'flashcards',
    component: FlashcardsComponent
  },
  {
    path: 'preguntas',
    component: PreguntasFlashcardsComponent,
  },
  {
    path:'estudiar-flashcards',
    component: StudyFlashcardsComponent
  }
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LearnRoutingModule { }
