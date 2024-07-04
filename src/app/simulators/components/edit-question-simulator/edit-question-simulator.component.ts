import { Component, Inject, OnInit } from '@angular/core';
import { UpdateSimulatorQuestion } from '../../interfaces/simulators.interface';
import { SimulatorsService } from '../../services/simulators.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IdEstados } from '../../../shared/interfaces/estados.interface';

@Component({
  selector: 'app-edit-question-simulator',
  templateUrl: './edit-question-simulator.component.html',
  styles: ``
})
export class EditQuestionSimulatorComponent implements OnInit{

  datosSimulador!: any;
  validForm: boolean = false;
  idSimulador: number = this.data.idSimulador;

  constructor(
    private simulatorService: SimulatorsService,
    private dialogRef: MatDialogRef<EditQuestionSimulatorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(){
    this.getSimulatorQuestion(this.data.idPregunta);
    console.log('ID PREGUNTA',this.data.idPregunta)
    console.log('DATOS PREVIO EDICIÓN',this.getSimulatorQuestion(this.data.idPregunta));
  }

  getSimulatorQuestion(idPregunta: number) {
    this.simulatorService.getSimulatorQuestion(idPregunta).subscribe((res) => {
      this.datosSimulador = res.data;
      console.log('DATOS SIMULADOR',this.datosSimulador);
    });
  }

  saveQuestion() {
    if (!this.validForm) {
      return;
    }

    const simulador: UpdateSimulatorQuestion = {
      idSimulador: this.data.idSimulador,
      idPregunta: this.data.idPregunta,
      pregunta: this.datosSimulador.pregunta, 
      idTipoPregunta: this.datosSimulador.idTipoPregunta,
      opcionesRespuestas: this.datosSimulador.opcionesRespuestas,
    };


    this.simulatorService.updateSimulatorQuestion(simulador).subscribe((res:any) => {
      console.log('RESPUESTA EDITANDO',res);
      this.CloseModal(res.statusCode.toString());
    });
  }

  getData(events: any) {
    this.datosSimulador = events;
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
