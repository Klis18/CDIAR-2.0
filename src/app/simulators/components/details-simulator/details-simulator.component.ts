import { Component, Inject, OnInit } from '@angular/core';
import { SimulatorsService } from '../../services/simulators.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HomeService } from '../../../home/services/home.service';

@Component({
  selector: 'app-details-simulator',
  templateUrl: './details-simulator.component.html',
  styles: ``
})
export class DetailsSimulatorComponent implements OnInit{

  datosSimulador!: any;
  nivel = this.data.nivel;
  asignatura = this.data.asignatura;
  userRol: string = '';

  constructor(
    private simulatorService: SimulatorsService,
    private homeService: HomeService,
    public dialogRef: MatDialogRef<DetailsSimulatorComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.getDetailsSimulador(this.data.id);

    this.homeService.obtenerDatosMenu().subscribe((user) => {
      this.userRol = user.data?.rol;
    });
  }

  
  getDetailsSimulador(idSimulador: number) {
    this.simulatorService.getDatosSimulator(idSimulador).subscribe((res: any) => {
      this.datosSimulador = res?.data;
    });
  }

  redirigirIniciarSimulador() {
    this.saveSimulatorStarted(this.data.id);
    this.router.navigate(['/simuladores/iniciar-simulador',{id: this.data.id, simulador: this.data.nombreSimulador}]);
  }

  saveSimulatorToReview() {
    this.simulatorService.SaveSimulatorToReview(this.data.id).subscribe(() => {
    });
  }

  saveSimulatorStarted(idSimulador: number) {
    this.simulatorService.saveSimulatorStarted(idSimulador).subscribe(() => {
    });
  }

  cancelar() {
    this.dialogRef.close();
  }
}
