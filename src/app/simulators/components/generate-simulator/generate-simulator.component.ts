import { Component } from '@angular/core';
import { SimulatorsService } from '../../services/simulators.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NewSimulator } from '../../interfaces/simulators.interface';

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
              private dialogRef: MatDialogRef<GenerateSimulatorComponent>,
  ) {}
  
  saveMazo(){
    if(!this.validForm){
      console.log('DATOS RECURSOS: ', this.datosSimulador);
      return;
    }
  
    const simulator: NewSimulator = {
      idNivel: this.datosSimulador.idNivel,
      idAsignatura: this.datosSimulador.idAsignatura,
      nombreSimulador: this.datosSimulador.nombreSimulador,
    }
    
    console.log('Simulador: ', simulator);

    this.simulatorService.generateSimulator(simulator)
    .subscribe((res) => {
      this.CloseModal(res.statusCode.toString())
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
    console.log('EVENTO ASIGNATURA: ', event);
    this.asignaturas = event;
  }
   cancelar() {
    this.dialogRef.close();
  }
}
