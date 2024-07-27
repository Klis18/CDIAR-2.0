import { Component, Inject, OnInit } from '@angular/core';
import { VideolearnService } from '../../services/videolearn.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VerifyAnswerComponent } from '../../../shared/pages/verify-answer/verify-answer.component';

@Component({
  selector: 'app-videolearn-show-question',
  templateUrl: './videolearn-show-question.component.html',
  styles: ``
})
export class VideolearnShowQuestionComponent{
  
  question = this.data.question;
  selectedOption!: number | null;
  isDisabled = false;

  constructor(
    private videolearnService: VideolearnService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<VideolearnShowQuestionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  selectOption(index: number) {
    this.selectedOption = index;
  }

  submitAnswer() {
    if (this.selectedOption !== null) {
      const isCorrect = this.question.opcionesRespuestas[this.selectedOption].esCorrecta;
      if (isCorrect) {
        this.respuestaCorrecta();
        this.dialogRef.close({ result: 'answered', puntaje: 1 });
      } else {
        this.respuestaIncorrecta();
        this.dialogRef.close({ result: 'answered', puntaje: 0 });
      }
    } else {
      this.isDisabled = true;
    }
  }

  respuestaCorrecta(){
    const dialogRef = this.dialog.open(VerifyAnswerComponent, {
      data: { imagen: 'correcta', mensaje: 'Respuesta Correcta' }
    });

    setTimeout(() => {
      dialogRef.close();
    }, 2000);
  }

  respuestaIncorrecta(){
    const dialogRef = this.dialog.open(VerifyAnswerComponent, {
      data: { imagen: 'incorrecta', mensaje: 'Respuesta Incorrecta' }
    });

    setTimeout(() => {
      dialogRef.close();
    }, 2000);
  }
}
