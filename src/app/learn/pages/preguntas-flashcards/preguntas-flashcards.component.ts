import { Component, Input } from '@angular/core';
import { LearnService } from '../../services/learn.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddQuestionFlashcardComponent } from '../../components/add-question-flashcard/add-question-flashcard.component';

@Component({
  selector: 'app-preguntas-flashcards',
  templateUrl: './preguntas-flashcards.component.html',
  styles: ``
})
export class PreguntasFlashcardsComponent {
  // @Input() nombreMazo: string='';

  nombreMazo: string = '';
  idMazo: number = 0;

  constructor(public dialog: MatDialog, private route: ActivatedRoute) { }

  ngOnInit() {
    // this.learnService.nombreMazoActual.subscribe(nombreMazo => this.nombreMazo = nombreMazo);
    this.route.params.subscribe(params => {
      this.nombreMazo = params['mazo'];
      this.idMazo = params['id'];
      // console.log(data);
    });
  }

  openDialog() {
    this.dialog.open(AddQuestionFlashcardComponent, {
      width: '50%',
      maxHeight: '80%',
      data: {id: this.idMazo},
    });
  }

}
