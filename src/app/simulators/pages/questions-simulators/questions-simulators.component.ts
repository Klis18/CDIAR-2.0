import { Component, inject } from '@angular/core';
import { AddQuestionSimulatorComponent } from '../../components/add-question-simulator/add-question-simulator.component';
import { SimulatorsService } from '../../services/simulators.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from '../../../home/services/home.service';

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

    this.homeService.obtenerDatosMenu().subscribe((user:any) => {
      this.nombreUsuario = user.data.userName;
      this.rol = user.data.rol;
    });

    
    this.simulatorService.getDatosSimulator(this.idSimulador).subscribe((res) => {
      this.estadoSimulador = res.data.estado;
      this.creadorSimulador = res.data.usuarioCreador;
      this.nombreRevisor = res.data.nombreRevisor;
    });
    
    //TODO:
    // this.learnService.getObservacion(this.idMazo).subscribe((res) => {
    //   console.log(res);
    //   this.observacionRechazo = res.data.observacion;
    // });
    
  }

  openDialog() {
    this.dialog.open(AddQuestionSimulatorComponent, {
      width: '40%',
      maxHeight: '80%',
      data: {id: this.idSimulador},
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
    return this.rol === 'Docente' && this.nombreRevisor === this.nombreUsuario && this.estadoSimulador != 'Aprobado' && this.estadoSimulador != 'Rechazado';
  }

  canPublish(){
    return this.creadorSimulador === this.nombreUsuario && (this.estadoSimulador !== 'Aprobado' && this.estadoSimulador !== 'Ingresado');
  }

  canCreate(){
    const Estudiante = this.rol === 'Estudiante' ;
    const Docente = this.rol === 'Docente' && this.creadorSimulador=== this.nombreUsuario;
    return Estudiante || Docente;
  }

  //TODO:
  // publishMazo(idStatus: number){
  //   const mazo: updateStatusMazo = {
  //     idMazo: this.idMazo,
  //     idEstado: idStatus
    
  //   };
  //   this.learnService.publicarMazo(mazo).subscribe((res) => {
  //     console.log(res);
  //   });
  // }

  //TODO:
  // reprobarMazo() {
  //   this.dialog.open(ObservacionRechazoComponent, {
  //     width: '40%',
  //     maxHeight: '80%',
  //     data: {id: this.idMazo},
  //   });
  // }

  // viewObservation(){
  //   this.observationVisible = true;
  // }

  // canViewObservation(){
  //   return this.rol ==='Estudiante' && this.observacionRechazo !== null;
  // }
}
