import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlashcardsComponent } from './pages/flashcards/flashcards.component';
import { PreguntasFlashcardsComponent } from './pages/preguntas-flashcards/preguntas-flashcards.component';
import { StudyFlashcardsComponent } from './pages/study-flashcards/study-flashcards.component';
import { VideolearnComponent } from './pages/videolearn/videolearn.component';
import { StartVideolearnComponent } from './pages/start-videolearn/start-videolearn.component';
import { VideoPlayerComponent } from './pages/video-player/video-player.component';
import { AuthGuard } from '../auth/guards/auth.guard';

const routes: Routes = [
  {
    path: 'flashcards',
    component: FlashcardsComponent,
    canActivate: [AuthGuard],
    canMatch: [AuthGuard],
    data: { roles: ['Estudiante','Docente'] },
  },
  {
    path: 'preguntas',
    component: PreguntasFlashcardsComponent,
    canActivate: [AuthGuard],
    canMatch: [AuthGuard],
    data: { roles: ['Admin','Estudiante','Docente'] },
  },
  {
    path:'estudiar-flashcards',
    component: StudyFlashcardsComponent,
    canActivate: [AuthGuard],
    canMatch: [AuthGuard],
    data: { roles: ['Estudiante','Docente'] },
  },
  {
    path: 'videolearns',
    component: VideolearnComponent,
    canActivate: [AuthGuard],
    canMatch: [AuthGuard],
    data: { roles: ['Estudiante','Docente'] },
  },
  {
    path: 'preguntas-video',
    component: StartVideolearnComponent,
    canActivate: [AuthGuard],
    canMatch: [AuthGuard],
    data: { roles: ['Estudiante','Docente'] },
  },
  {
    path:'video-player',
    component: VideoPlayerComponent,
    canActivate: [AuthGuard],
    canMatch: [AuthGuard],
    data: { roles: ['Admin','Estudiante','Docente'] },
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LearnRoutingModule { }
