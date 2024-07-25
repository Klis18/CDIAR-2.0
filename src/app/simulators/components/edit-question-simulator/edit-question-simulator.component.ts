import { Component, Inject, OnInit } from '@angular/core';
import { UpdateSimulatorQuestion } from '../../interfaces/simulators.interface';
import { SimulatorsService } from '../../services/simulators.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { CardMessageComponent } from '../../../shared/pages/card-message/card-message.component';

@Component({
  selector: 'app-edit-question-simulator',
  templateUrl: './edit-question-simulator.component.html',
  styles: ``
})
export class EditQuestionSimulatorComponent implements OnInit{

  datosSimulador!: any;
  validForm: boolean = false;
  idSimulador: number = this.data.idSimulador;
  isDisabled: boolean = this.data.isDisabled;
  title: string = this.data.titulo;


  constructor(
    private simulatorService: SimulatorsService,
    private spinnerService: SpinnerService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<EditQuestionSimulatorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(){
    this.getSimulatorQuestion(this.data.idPregunta);
  }

  getSimulatorQuestion(idPregunta: number) {
    this.simulatorService.getSimulatorQuestion(idPregunta).subscribe((res) => {
      this.datosSimulador = res.data;
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
    this.spinnerService.showSpinner();

    this.simulatorService.updateSimulatorQuestion(simulador).subscribe((res:any) => {
      this.spinnerService.hideSpinner();

      this.isDisabled = true;
    },
    (error) => {
        this.spinnerService.hideSpinner();
        this.dialog.open(CardMessageComponent, {
          width: '80%',
          maxWidth: '500px',
          maxHeight: '80%',
          data: {status:'error', mensaje: 'Error al editar la pregunta, por favor intente de nuevo.'},
        });
      });  
    this.dialogRef.close();
  }

  editar() {
    this.isDisabled = !this.isDisabled;
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
