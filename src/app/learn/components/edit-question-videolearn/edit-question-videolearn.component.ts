import { Component, Inject } from '@angular/core';
import { VideolearnService } from '../../services/videolearn.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UpdateSimulatorQuestion } from '../../../simulators/interfaces/simulators.interface';
import { editQuestionsVideolearn } from '../../interfaces/videolearn.interface';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { CardMessageComponent } from '../../../shared/pages/card-message/card-message.component';

@Component({
  selector: 'app-edit-question-videolearn',
  templateUrl: './edit-question-videolearn.component.html',
  styles: ``
})
export class EditQuestionVideolearnComponent {
  datosVideoLearn!: any;
  validForm: boolean = false;
  idVideoLearn: number = Number(this.data.idVideoLearn);
  isDisabled: boolean = this.data.isDisabled;
  title: string = this.data.titulo;


  constructor(
    private videolearnService: VideolearnService,
    private dialogRef: MatDialogRef<EditQuestionVideolearnComponent>,
    private spinnerService: SpinnerService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(){
    this.getVideolearnQuestion(this.data.idPregunta);
  }

  getVideolearnQuestion(idPregunta: number) {
    this.videolearnService.getQuestion(idPregunta).subscribe((res) => {
      this.datosVideoLearn = res.data;
    });
  }

  saveQuestion() {
    if (!this.validForm) {
      return;
    }

    const videolearn: editQuestionsVideolearn = {
      idVideoLearn: Number(this.data.idVideoLearn),
      idPregunta: this.data.idPregunta,
      pregunta: this.datosVideoLearn.pregunta, 
      opcionesRespuestas: this.datosVideoLearn.opcionesRespuestas,
    };

    this.spinnerService.showSpinner();

    this.videolearnService.updateVideolearnQuestions(videolearn).subscribe((res:any) => {
      this.spinnerService.hideSpinner();
      this.isDisabled = true;
      this.dialogRef.close();
    },
    (error) => {
        this.spinnerService.hideSpinner();
        this.dialog.open(CardMessageComponent, {
          width: '80%',
          maxWidth: '500px',
          maxHeight: '80%',
          data: {status:'error', mensaje: 'Error al editar pregunta, por favor intente de nuevo.'},
        });
      });

  }

  editar() {
    this.isDisabled = !this.isDisabled;
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
