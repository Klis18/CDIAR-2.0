import { Component, Inject } from '@angular/core';
import { SimulatorsService } from '../../services/simulators.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewSimulator, NewSimulatorQuestion } from '../../interfaces/simulators.interface';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { CardMessageComponent } from '../../../shared/pages/card-message/card-message.component';

@Component({
  selector: 'app-add-question-simulator',
  templateUrl: './add-question-simulator.component.html',
  styles: ``
})
export class AddQuestionSimulatorComponent {
  datosSimulador!: any;
  validForm: boolean = false;
  idSimulador: number = this.data.id;
  constructor(
    private simulatorService: SimulatorsService,
    private spinnerService: SpinnerService,
    private dialog: MatDialog,
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

    this.spinnerService.showSpinner();

    this.simulatorService.addSimulatorQuestion(simulador).subscribe((res) => {
      this.spinnerService.hideSpinner();

      this.CloseModal(res.statusCode.toString());
    },
    (error) => {
        this.spinnerService.hideSpinner();
        this.dialog.open(CardMessageComponent, {
          width: '80%',
          maxWidth: '500px',
          maxHeight: '80%',
          data: {status:'error', mensaje: 'Error al agregar la pregunta, por favor intente de nuevo.'},
        });
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
