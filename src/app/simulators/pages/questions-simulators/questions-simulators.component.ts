import { Component, inject } from '@angular/core';
import { AddQuestionSimulatorComponent } from '../../components/add-question-simulator/add-question-simulator.component';
import { SimulatorsService } from '../../services/simulators.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from '../../../home/services/home.service';
import { updateStatusSimulator } from '../../interfaces/simulators.interface';
import { ObservacionRechazoComponent } from '../../../shared/pages/observacion-rechazo/observacion-rechazo.component';

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
              public router: Router,  
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.nombreSimulador = params['simulador'];
      this.idSimulador= params['id'];
    });

    this.homeService.obtenerDatosMenu().subscribe((user:any) => {
      this.nombreUsuario = user.data?.userName;
      this.rol = user.data?.rol;
    });

    
    this.simulatorService.getDatosSimulator(this.idSimulador).subscribe((res) => {
      this.estadoSimulador = res.data?.estado;
      this.creadorSimulador = res.data?.usuarioCreador;
      this.nombreRevisor = res.data?.nombreRevisor;
    });
    
    
    this.simulatorService.getObservationSimulator(this.idSimulador).subscribe((res) => {
      this.observacionRechazo = res.data?.observacion;
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
    const Estudiante = this.rol === 'Estudiante' && this.creadorSimulador=== this.nombreUsuario && this.estadoSimulador !== 'Aprobado';
    const Docente = this.rol === 'Docente' && this.creadorSimulador=== this.nombreUsuario;
    return Estudiante || Docente;
  }

  
  updateStatusSimulator(idStatus: number){
    const simulator: updateStatusSimulator = {
      idSimulador: this.idSimulador,
      idEstado: idStatus
    
    };
    this.simulatorService.actualizarEstadoSimulator(simulator).subscribe((res) => {
      this.router.navigate(['/simuladores/repositorio-simuladores']);

    });
  }

  
  reprobarSimulador() {
    this.dialog.open(ObservacionRechazoComponent, {
      width: '55%',
      maxHeight: '90%',
      data: {id: this.idSimulador, opcion:'simulador'},
    });
  }

  viewObservation(){
    this.dialog.open(ObservacionRechazoComponent, {
      width: '55%',
      maxHeight: '90%',
      data: {id: this.idSimulador, opcion:'verObservacionSimulador'},
    });
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
