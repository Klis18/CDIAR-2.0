import { Component, Inject } from '@angular/core';
import { VideolearnService } from '../../services/videolearn.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { addQuestionsVideolearn } from '../../interfaces/videolearn.interface';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { CardMessageComponent } from '../../../shared/pages/card-message/card-message.component';

@Component({
  selector: 'app-add-questions-videolearn',
  templateUrl: './add-questions-videolearn.component.html',
  styles: ``
})
export class AddQuestionsVideolearnComponent {
  datosVideoLearn!: any;
  validForm: boolean = false;
  idVideoLearn: number = this.data.id;
  minutoVideo: number = this.data.minutos;
  constructor(
    private videolearnService: VideolearnService,
    private spinnerService: SpinnerService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AddQuestionsVideolearnComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  saveQuestion() {
    if (!this.validForm) {
      return;
    }

    const videolearn: addQuestionsVideolearn = {
      idVideoLearn: this.idVideoLearn,
      pregunta: this.datosVideoLearn.pregunta, 
      opcionesRespuestas: this.datosVideoLearn.opcionesRespuestas,
      minutoVideo: this.minutoVideo,
    };

    this.spinnerService.showSpinner();

    this.videolearnService.addVideolearnQuestions(videolearn).subscribe((res) => {
      this.spinnerService.hideSpinner();
      this.CloseModal(res.statusCode.toString());
    },
    (error) => {
        this.spinnerService.hideSpinner();
        this.dialog.open(CardMessageComponent, {
          width: '80%',
          maxWidth: '500px',
          maxHeight: '80%',
          data: {status:'error', mensaje: 'Error al guardar el recursos, por favor intente de nuevo.'},
        });
      });
  }

  getData(events: any) {
    this.datosVideoLearn = events;
  }

  CloseModal(mensaje?: string) {
    this.dialogRef.close(mensaje);
  }

  getValidForm(event: any) {
    this.validForm = event;
  }


  cancelar() {
    this.dialogRef.close();
  }
}
