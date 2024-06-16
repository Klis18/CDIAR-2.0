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
    FlashcardsTableComponent
  ],
  imports: [
    CommonModule,
    LearnRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class LearnModule { }
