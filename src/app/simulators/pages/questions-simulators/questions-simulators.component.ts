import { Component, inject } from '@angular/core';
import { AddQuestionSimulatorComponent } from '../../components/add-question-simulator/add-question-simulator.component';
import { SimulatorsService } from '../../services/simulators.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from '../../../home/services/home.service';
import { updateStatusSimulator } from '../../interfaces/simulators.interface';
import { ObservacionRechazoSimuladoresComponent } from '../../components/observacion-rechazo-simuladores/observacion-rechazo-simuladores.component';

@Component({
  selector: 'app-questions-simulators',
  templateUrl: './questions-simulators.component.html',
  styles: ``
})
export class QuestionsSimulatorsComponent {
  nombreSimulador: string = '';
  idSimulador: number = 0;
  creadorSimulador: string = '';
  estadoSimulador: string = '';
  searchInfo: any;
  nombreUsuario: string = '';
  rol: string = '';
  nombreRevisor: string = '';
  observacionRechazo: string = '';
  observationVisible: boolean = false;

  private homeService = inject(HomeService);
  
  constructor(private simulatorService: SimulatorsService,
              public dialog: MatDialog, 
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.nombreSimulador = params['simulador'];
      this.idSimulador= params['id'];
    });

    console.log('ID SIM',this.idSimulador);
    this.homeService.obtenerDatosMenu().subscribe((user:any) => {
      this.nombreUsuario = user.data.userName;
      this.rol = user.data.rol;
      console.log('nombreUsuario', this.nombreUsuario);
    });

    
    this.simulatorService.getDatosSimulator(this.idSimulador).subscribe((res) => {
      this.estadoSimulador = res.data.estado;
      this.creadorSimulador = res.data.usuarioCreador;
      this.nombreRevisor = res.data.nombreRevisor;
      console.log('NOMBRE REVISOR', this.nombreRevisor);
    });
    
    
    this.simulatorService.getObservationSimulator(this.idSimulador).subscribe((res) => {
      console.log(res);
      this.observacionRechazo = res.data.observacion;
    });
    
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddQuestionSimulatorComponent, {
      width: '40%',
      maxHeight: '80%',
      data: {id: this.idSimulador},
    });
    
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTable();
      }
    });
  }

  emitSearch(res: any) {
    if (res) {
      this.searchInfo = res;
    }
  }
  reloadTable: boolean = false;


  loadTable() {
    this.reloadTable = true;
  }

  loadedTale() {
    this.reloadTable = false;
  }

  
  
  canAprove() {
    return this.rol === 'Docente' && this.nombreRevisor.trim() === this.nombreUsuario.trim() && this.estadoSimulador != 'Aprobado' && this.estadoSimulador != 'Rechazado';

  }

  canPublish(){
    return this.creadorSimulador === this.nombreUsuario && (this.estadoSimulador !== 'Aprobado' && this.estadoSimulador !== 'Ingresado');
  }

  canCreate(){
    const Estudiante = this.rol === 'Estudiante' ;
    const Docente = this.rol === 'Docente' && this.creadorSimulador=== this.nombreUsuario;
    return Estudiante || Docente;
  }

  
  updateStatusSimulator(idStatus: number){
    const simulator: updateStatusSimulator = {
      idSimulador: this.idSimulador,
      idEstado: idStatus
    
    };
    this.simulatorService.actualizarEstadoSimulator(simulator).subscribe((res) => {
      console.log(res);
    });
  }

  
  reprobarSimulador() {
    this.dialog.open(ObservacionRechazoSimuladoresComponent, {
      width: '40%',
      maxHeight: '80%',
      data: {id: this.idSimulador},
    });
  }

  viewObservation(){
    this.observationVisible = true;
  }

  canViewObservation(){
    return this.rol ==='Estudiante' && this.observacionRechazo !== null;
  }

  publishSimulator(){
    if(this.rol === 'Docente'){
      this.updateStatusSimulator(2);
  }
  else{
    this.updateStatusSimulator(1);
  }
  }
}
