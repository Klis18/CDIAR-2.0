import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlashcardsComponent } from './pages/flashcards/flashcards.component';
import { PreguntasFlashcardsComponent } from './pages/preguntas-flashcards/preguntas-flashcards.component';
import { StudyFlashcardsComponent } from './pages/study-flashcards/study-flashcards.component';
import { VideolearnComponent } from './pages/videolearn/videolearn.component';
import { VideolearnsQuestionsComponent } from './pages/videolearns-questions/videolearns-questions.component';
import { ShowVideoComponent } from './pages/show-video/show-video.component';
import { StartVideolearnComponent } from './pages/start-videolearn/start-videolearn.component';

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
  },
  {
    path: 'videolearns',
    component: VideolearnComponent
  },
  {
    path:'preguntas-videolearn',
    component: VideolearnsQuestionsComponent
  },
  {
    path:'iniciar-videolearn',
    component: ShowVideoComponent
  },
  {
    path: 'preguntas-video',
    component: StartVideolearnComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LearnRoutingModule { }
