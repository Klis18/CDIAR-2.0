import { Component, Inject } from '@angular/core';
import { SimulatorsService } from '../../services/simulators.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NewSimulator, NewSimulatorQuestion } from '../../interfaces/simulators.interface';

@Component({
  selector: 'app-add-question-simulator',
  templateUrl: './add-question-simulator.component.html',
  styles: ``
})
export class AddQuestionSimulatorComponent {
  datosSimulador!: any;
  validForm: boolean = false;
  // asignaturas: { label: string; value: string }[] = [];
  idSimulador: number = this.data.id;
  constructor(
    private simulatorService: SimulatorsService,
    private dialogRef: MatDialogRef<AddQuestionSimulatorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  saveQuestion() {
    if (!this.validForm) {
      return;
    }

    const simulador: NewSimulatorQuestion = {
      idSimulador: this.idSimulador,
      pregunta: this.datosSimulador.pregunta, 
      idTipoPregunta: this.datosSimulador.idTipoPregunta,
      opcionesRespuestas: this.datosSimulador.opcionesRespuestas,
    };


    this.simulatorService.addSimulatorQuestion(simulador).subscribe((res) => {
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

  // updateAsignatura(event: any) {
  //   this.asignaturas = event;
  // }
  cancelar() {
    this.dialogRef.close();
  }
}
