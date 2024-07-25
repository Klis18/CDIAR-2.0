import { Component, Inject } from '@angular/core';
import { VideolearnService } from '../../services/videolearn.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-videolearn-show-question',
  templateUrl: './videolearn-show-question.component.html',
  styles: ``
})
export class VideolearnShowQuestionComponent {
  
  question = this.data.question;
  selectedOption: number | null = null;
  isDisabled = false;

  constructor(
    private videolearnService: VideolearnService,
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
        this.dialogRef.close({ result: 'answered', puntaje: 1 });
      } else {
        this.dialogRef.close({ result: 'answered', puntaje: 0 });
      }
    } else {
      this.isDisabled = true;
    }
  }
}
