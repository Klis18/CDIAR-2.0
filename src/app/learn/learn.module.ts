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
    MazosEstudiadosComponent
  ],
  imports: [
    CommonModule,
    LearnRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    NgSelectModule
  ],
  exports:[
    CardsFlashcardsComponent
  ],
  providers: [FlashcardsComponent]

})
export class LearnModule { }
