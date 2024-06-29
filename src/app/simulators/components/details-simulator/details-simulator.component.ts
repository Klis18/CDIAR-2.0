import { Component, Inject, OnInit } from '@angular/core';
import { SimulatorsService } from '../../services/simulators.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-details-simulator',
  templateUrl: './details-simulator.component.html',
  styles: ``
})
export class DetailsSimulatorComponent implements OnInit{

  datosSimulador!: any;
  nivel = this.data.nivel;
  asignatura = this.data.asignatura;

  constructor(
    private simulatorService: SimulatorsService,
    public dialogRef: MatDialogRef<DetailsSimulatorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.getDetailsSimulador(this.data.id);
    console.log(this.getDetailsSimulador(this.data.id))

    console.log(this.data)
  }

  
  getDetailsSimulador(idSimulador: number) {
    this.simulatorService.getDatosSimulator(idSimulador).subscribe((res: any) => {
      this.datosSimulador = res.data;
      console.log(this.datosSimulador)
    });
  }


  cancelar() {
    this.dialogRef.close();
  }
}
