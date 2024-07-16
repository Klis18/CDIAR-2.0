import { Component, inject } from '@angular/core';
import { HomeService } from '../../../home/services/home.service';
import { VideolearnService } from '../../services/videolearn.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { updateStatusVideolearn } from '../../interfaces/videolearn.interface';
import { ObservacionRechazoComponent } from '../../../shared/pages/observacion-rechazo/observacion-rechazo.component';
import { AddQuestionsVideolearnComponent } from '../../components/add-questions-videolearn/add-questions-videolearn.component';

@Component({
  selector: 'app-videolearns-questions',
  templateUrl: './videolearns-questions.component.html',
  styles: ``
})
export class VideolearnsQuestionsComponent {
  nombreVideoLearn: string = '';
  idVideoLearn: number = 0;
  creadorVideolearn: string = '';
  estadoVideolearn: string = '';
  searchInfo: any;
  nombreUsuario: string = '';
  rol: string = '';
  nombreRevisor: string = '';
  observacionRechazo: string = '';
  observationVisible: boolean = false;

  private homeService = inject(HomeService);
  
  constructor(private videolearnService: VideolearnService,
              public dialog: MatDialog, 
              public router: Router,  
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.nombreVideoLearn = params['videolearn'];
      this.idVideoLearn= params['id'];
    });

    console.log('ID SIM',this.idVideoLearn);
    this.homeService.obtenerDatosMenu().subscribe((user:any) => {
      this.nombreUsuario = user.data.userName;
      this.rol = user.data.rol;
      console.log('nombreUsuario', this.nombreUsuario);
    });

    
    this.videolearnService.getVideoLearn(this.idVideoLearn).subscribe((res) => {
      this.estadoVideolearn = res.data.estado;
      this.creadorVideolearn = res.data.usuarioCreador;
      this.nombreRevisor = res.data.nombreRevisor;
      console.log('NOMBRE REVISOR', this.nombreRevisor);
    });
    
    
    // this.videolearnService.viewObservation(this.idVideoLearn).subscribe((res) => {
    //   console.log(res);
    //   this.observacionRechazo = res.data.observacion;
    // });
    
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddQuestionsVideolearnComponent, {
      width: '40%',
      maxHeight: '80%',
      data: {id: this.idVideoLearn},
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
    return this.rol === 'Docente' && this.nombreRevisor.trim() === this.nombreUsuario.trim() && this.estadoVideolearn != 'Aprobado' && this.estadoVideolearn != 'Rechazado';

  }

  canPublish(){
    return this.creadorVideolearn === this.nombreUsuario && (this.estadoVideolearn !== 'Aprobado' && this.estadoVideolearn !== 'Ingresado');
  }

  canCreate(){
    const Estudiante = this.rol === 'Estudiante' && this.creadorVideolearn=== this.nombreUsuario && this.estadoVideolearn !== 'Aprobado';
    const Docente = this.rol === 'Docente' && this.creadorVideolearn=== this.nombreUsuario;
    return Estudiante || Docente;
  }

  
  updateStatusVideolearn(idStatus: number){
    const videolearn: updateStatusVideolearn = {
      idVideoLearn: this.idVideoLearn,
      idEstado: idStatus
    
    };
    this.videolearnService.changeStatusVideolearn(videolearn).subscribe((res) => {
      console.log(res);
      this.router.navigate(['/learn/videolearns']);

    });
  }

  
  reprobarVideoLearn() {
    this.dialog.open(ObservacionRechazoComponent, {
      width: '55%',
      maxHeight: '90%',
      data: {id: this.idVideoLearn, opcion:'videolearn'},
    });
  }

  viewObservation(){
    this.dialog.open(ObservacionRechazoComponent, {
      width: '55%',
      maxHeight: '90%',
      data: {id: this.idVideoLearn, opcion:'verObservacionVideolearn'},
    });
  }

  canViewObservation(){
    return this.rol ==='Estudiante' && this.observacionRechazo !== '';
  }

  publishVideoLearn(){
    if(this.rol === 'Docente'){
      this.updateStatusVideolearn(2);
  }
  else{
    this.updateStatusVideolearn(1);
  }
  }
}
