import { Component, Inject } from '@angular/core';
import { VideolearnService } from '../../services/videolearn.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UpdateSimulatorQuestion } from '../../../simulators/interfaces/simulators.interface';
import { editQuestionsVideolearn } from '../../interfaces/videolearn.interface';

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
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(){
    this.getVideolearnQuestion(this.data.idPregunta);
    console.log('ID PREGUNTA',this.data.idPregunta)
    console.log('DATOS PREVIO EDICIÓN',this.getVideolearnQuestion(this.data.idPregunta));
  }

  getVideolearnQuestion(idPregunta: number) {
    this.videolearnService.getQuestion(idPregunta).subscribe((res) => {
      this.datosVideoLearn = res.data;
      console.log('DATOS SIMULADOR',this.datosVideoLearn);
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
      minutoVideo: this.datosVideoLearn.minutoVideo,
      opcionesRespuestas: this.datosVideoLearn.opcionesRespuestas,
    };

    console.log('DATOS A GUARDAR',videolearn);
    this.videolearnService.updateVideolearnQuestions(videolearn).subscribe((res:any) => {
      // manejar la respuesta exitosa
      console.log('Response:', res);
      this.isDisabled = true;
      this.dialogRef.close();
    },
  );
  }

  //   this.videolearnService.updateVideolearnQuestions(videolearn).subscribe((res:any) => {
  //     // manejar la respuesta exitosa
  //     console.log('Response:', res);
  //     this.isDisabled = true;
  //   },
  //   (error) => {
  //     // manejar el error
  //     console.error('Error:', error);
  //   }
  //   );
  //   this.dialogRef.close();
  // }

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
