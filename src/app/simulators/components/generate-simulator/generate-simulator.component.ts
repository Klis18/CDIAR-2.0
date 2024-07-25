import { Component } from '@angular/core';
import { SimulatorsService } from '../../services/simulators.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewSimulator } from '../../interfaces/simulators.interface';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { CardMessageComponent } from '../../../shared/pages/card-message/card-message.component';

@Component({
  selector: 'app-generate-simulator',
  templateUrl: './generate-simulator.component.html',
  styles: ``
})
export class GenerateSimulatorComponent {
  datosSimulador!:any;
  validForm:boolean = true;
  asignaturas: { label: string; value: string }[] = [];

  constructor(private simulatorService:SimulatorsService,
              private spinnerService: SpinnerService,
              private dialog: MatDialog,
              private dialogRef: MatDialogRef<GenerateSimulatorComponent>,
  ) {}
  
  saveSimulador(){
    if(!this.validForm){
      return;
    }
  
    const simulator: NewSimulator = {
      idNivel: this.datosSimulador.idNivel,
      idAsignatura: this.datosSimulador.idAsignatura,
      nombreSimulador: this.datosSimulador.nombreSimulador,
    }
    
    this.spinnerService.showSpinner();

    this.simulatorService.generateSimulator(simulator)
    .subscribe((res) => {
      this.spinnerService.hideSpinner();

      this.CloseModal(res.statusCode.toString())
    },
    (error) => {
        this.spinnerService.hideSpinner();
        this.dialog.open(CardMessageComponent, {
          width: '80%',
          maxWidth: '500px',
          maxHeight: '80%',
          data: {status:'error', mensaje: 'Error al generar el simulador, por favor intente de nuevo.'},
        });
      });  

    
  }

  getData(events:any){
    this.datosSimulador = events;
  }

  CloseModal(mensaje?:string){
    this.dialogRef.close(mensaje);
  }

  getValidForm(event:any){
    this.validForm = event;
  }

  updateAsignatura(event: any) {
    this.asignaturas = event;
  }
   cancelar() {
    this.dialogRef.close();
  }
}
