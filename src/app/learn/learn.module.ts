import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LearnRoutingModule } from './learn-routing.module';
import { MaterialModule } from '../material/material.module';
import { FlashcardsComponent } from './pages/flashcards/flashcards.component';
import { CardsFlashcardsComponent } from './components/cards-flashcards/cards-flashcards.component';
import { DetailsMazoComponent } from './components/details-mazo/details-mazo.component';
import { FormMazoComponent } from './components/form-mazo/form-mazo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddMazoComponent } from './components/add-mazo/add-mazo.component';
import { PreguntasFlashcardsComponent } from './pages/preguntas-flashcards/preguntas-flashcards.component';
import { QuestionsTableComponent } from './components/questions-table/questions-table.component';
import { QuestionFlashcardFormComponent } from './components/question-flashcard-form/question-flashcard-form.component';
import { AddQuestionFlashcardComponent } from './components/add-question-flashcard/add-question-flashcard.component';
import { FlashcardsTableComponent } from './components/flashcards-table/flashcards-table.component';
import { StudyFlashcardsComponent } from './pages/study-flashcards/study-flashcards.component';
import { SharedModule } from '../shared/shared.module';
import { EditFlashcardComponent } from './components/edit-flashcard/edit-flashcard.component';
import { EditMazoComponent } from './components/edit-mazo/edit-mazo.component';
import { ObservacionRechazoComponent } from './components/observacion-rechazo/observacion-rechazo.component';
import { MazosGuardadosComponent } from './components/mazos-guardados/mazos-guardados.component';
import { MazosEstudiadosComponent } from './components/mazos-estudiados/mazos-estudiados.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { VideolearnComponent } from './pages/videolearn/videolearn.component';
import { CardsVideolearnsComponent } from './components/cards-videolearns/cards-videolearns.component';
import { AddVideolearnComponent } from './components/add-videolearn/add-videolearn.component';
import { FormVideolearnComponent } from './components/form-videolearn/form-videolearn.component';
import { YoutubeViewComponent } from './components/youtube-view/youtube-view.component';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { EditVideolearnComponent } from './components/edit-videolearn/edit-videolearn.component';
import { VideolearnDetailsComponent } from './components/videolearn-details/videolearn-details.component';
import { VideolearnsQuestionsComponent } from './pages/videolearns-questions/videolearns-questions.component';
import { VideolearnQuestionsTableComponent } from './components/videolearn-questions-table/videolearn-questions-table.component';
import { AddQuestionsVideolearnComponent } from './components/add-questions-videolearn/add-questions-videolearn.component';
import { VideolearnsFormQuestionsComponent } from './components/videolearns-form-questions/videolearns-form-questions.component';
import { EditQuestionVideolearnComponent } from './components/edit-question-videolearn/edit-question-videolearn.component';
import { ShowVideoComponent } from './pages/show-video/show-video.component';
import { StartVideolearnComponent } from './pages/start-videolearn/start-videolearn.component';
import { SavedVideolearnsComponent } from './components/saved-videolearns/saved-videolearns.component';
import { RealizedVideolearnsComponent } from './components/realized-videolearns/realized-videolearns.component';
import { GenerateMazoComponent } from './components/generate-mazo/generate-mazo.component';


@NgModule({
  declarations: [
    FlashcardsComponent,
    CardsFlashcardsComponent,
    DetailsMazoComponent,
    FormMazoComponent,
    AddMazoComponent,
    PreguntasFlashcardsComponent,
    QuestionsTableComponent,
    QuestionFlashcardFormComponent,
    AddQuestionFlashcardComponent,
    FlashcardsTableComponent,
    StudyFlashcardsComponent,
    EditFlashcardComponent,
    EditMazoComponent,
    ObservacionRechazoComponent,
    MazosGuardadosComponent,
    MazosEstudiadosComponent,
    VideolearnComponent,
    CardsVideolearnsComponent,
    AddVideolearnComponent,
    FormVideolearnComponent,
    YoutubeViewComponent,
    EditVideolearnComponent,
    VideolearnDetailsComponent,
    VideolearnsQuestionsComponent,
    VideolearnQuestionsTableComponent,
    AddQuestionsVideolearnComponent,
    VideolearnsFormQuestionsComponent,
    EditQuestionVideolearnComponent,
    ShowVideoComponent,
    StartVideolearnComponent,
    SavedVideolearnsComponent,
    RealizedVideolearnsComponent,
    GenerateMazoComponent
  ],
  imports: [
    CommonModule,
    LearnRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    NgSelectModule,
    YouTubePlayerModule
  ],
  exports:[
    CardsFlashcardsComponent,
    CardsVideolearnsComponent
  ],
  providers: [FlashcardsComponent, VideolearnComponent]

})
export class LearnModule { }
