import { Component, Inject } from '@angular/core';
import { sendObservationSimulator, updateStatusSimulator } from '../../interfaces/simulators.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SimulatorsService } from '../../services/simulators.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-observacion-rechazo-simuladores',
  templateUrl: './observacion-rechazo-simuladores.component.html',
  styles: ``
})
export class ObservacionRechazoSimuladoresComponent {
  rol: string = '';
  observationForm!: FormGroup;
  estados: { label: string; value: string }[] = [];
  docentes: { label: string; value: string }[] = [];
  selectedTab: string = '';
  newData: string[] = [];
  idSimulador: number = this.data.id;
  

  constructor(
    private fb: FormBuilder,
    private simulatorService: SimulatorsService,
    private dialogRef: MatDialogRef<ObservacionRechazoSimuladoresComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  ngOnInit(){
    this.createForm(); 
    console.log('ID SIMULADOR', this.idSimulador);
  }


  createForm() {
    this.observationForm = this.fb.group({
      observation: ['', Validators.required],
    });

  }


  rechazarSimulador(){
    const observacionMessage = this.observationForm.get('observation')?.value;
    const observacion: sendObservationSimulator = {
      idSimulador: this.idSimulador,
      observacion: observacionMessage
    }

    this.simulatorService.sendObservationSimulator(observacion).subscribe((res) => {
      console.log('Observacion enviada', res);
      this.actualizarEstado();
    });
    this.dialogRef.close();
  }

  actualizarEstado(){
    const estado: updateStatusSimulator= {
      idSimulador: this.idSimulador,
      idEstado: 3
    }
    this.simulatorService.actualizarEstadoSimulator(estado).subscribe((res) => {
      console.log('Mazo rechazado', res);
    });
  }

  cancelar() {
    this.dialogRef.close();
  }
}
