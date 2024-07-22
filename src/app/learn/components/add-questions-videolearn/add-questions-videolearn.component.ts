import { Component, Inject } from '@angular/core';
import { VideolearnService } from '../../services/videolearn.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { addQuestionsVideolearn } from '../../interfaces/videolearn.interface';

@Component({
  selector: 'app-add-questions-videolearn',
  templateUrl: './add-questions-videolearn.component.html',
  styles: ``
})
export class AddQuestionsVideolearnComponent {
  datosVideoLearn!: any;
  validForm: boolean = false;
  // asignaturas: { label: string; value: string }[] = [];
  idVideoLearn: number = this.data.id;
  minutoVideo: number = this.data.minutos;
  constructor(
    private videolearnService: VideolearnService,
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

    console.log('Pregunta VideoLearn a guardar', videolearn);

    this.videolearnService.addVideolearnQuestions(videolearn).subscribe((res) => {
      this.CloseModal(res.statusCode.toString());
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

  // updateAsignatura(event: any) {
  //   this.asignaturas = event;
  // }
  cancelar() {
    this.dialogRef.close();
  }
}
