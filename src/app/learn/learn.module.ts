import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LearnRoutingModule } from './learn-routing.module';
import { MaterialModule } from '../material/material.module';
import { FlashcardsComponent } from './pages/flashcards/flashcards.component';
import { CardsFlashcardsComponent } from './components/cards-flashcards/cards-flashcards.component';


@NgModule({
  declarations: [
    FlashcardsComponent,
    CardsFlashcardsComponent
  ],
  imports: [
    CommonModule,
    LearnRoutingModule,
    MaterialModule
  ]
})
export class LearnModule { }
