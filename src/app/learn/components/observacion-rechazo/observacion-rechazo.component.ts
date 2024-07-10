import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LearnService } from '../../services/learn.service';
import { HomeService } from '../../../home/services/home.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { sendObservationMazo, updateStatusMazo } from '../../interfaces/mazo.interface';

@Component({
  selector: 'app-observacion-rechazo',
  templateUrl: './observacion-rechazo.component.html',
  styles: ``
})
export class ObservacionRechazoComponent {
  
  rol: string = '';
  observationForm!: FormGroup;
  estados: { label: string; value: string }[] = [];
  docentes: { label: string; value: string }[] = [];
  selectedTab: string = '';
  newData: string[] = [];
  idMazo: number = this.data.id;
  

  constructor(
    private fb: FormBuilder,
    private learnService: LearnService,
    private dialogRef: MatDialogRef<ObservacionRechazoComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  ngOnInit(){
    this.createForm(); 
    console.log('ID MAZO', this.idMazo);
  }


  createForm() {
    this.observationForm = this.fb.group({
      observation: ['', Validators.required],
    });

  }

  rechazarMazo(){
    const observacionMessage = this.observationForm.get('observation')?.value;
    const observacion: sendObservationMazo = {
      idMazo: this.idMazo,
      observacion: observacionMessage,
      observacionesArchivo: ''
    }

    this.learnService.enviarObservacion(observacion).subscribe((res) => {
      console.log('Observacion enviada', res);
      this.actualizarEstado();
    });
    this.dialogRef.close();
  }

  actualizarEstado(){
    const estado: updateStatusMazo= {
      idMazo: this.idMazo,
      idEstado: 3
    }
    this.learnService.publicarMazo(estado).subscribe((res) => {
      console.log('Mazo rechazado', res);
    });
  }

  cancelar() {
    this.dialogRef.close();
  }
}
