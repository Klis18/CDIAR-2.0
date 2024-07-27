import { Component, Input, inject } from '@angular/core';
import { LearnService } from '../../services/learn.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddQuestionFlashcardComponent } from '../../components/add-question-flashcard/add-question-flashcard.component';
import { HomeService } from '../../../home/services/home.service';
import { updateStatusMazo } from '../../interfaces/mazo.interface';
import { ObservacionRechazoComponent } from '../../../shared/pages/observacion-rechazo/observacion-rechazo.component';

@Component({
  selector: 'app-preguntas-flashcards',
  templateUrl: './preguntas-flashcards.component.html',
  styles: ``
})
export class PreguntasFlashcardsComponent {
  nombreMazo: string = '';
  idMazo: number = 0;
  creadorMazo: string = '';
  estadoMazo: string = '';
  searchInfo: any;
  nombreUsuario: string = '';
  rol: string = '';
  nombreRevisor: string = '';
  observacionRechazo: string = '';
  observationVisible: boolean = false;
  statusPublish: number = 0;

  private homeService = inject(HomeService);
  
  constructor(private learnService: LearnService,
              public dialog: MatDialog, 
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.nombreMazo = params['mazo'];
      this.idMazo = params['id'];
    });

    this.homeService.obtenerDatosMenu().subscribe((user) => {
      this.nombreUsuario = user.data.userName;
      this.rol = user.data.rol;
    });

    
    this.learnService.getDatosMazo(this.idMazo).subscribe((res) => {
      this.estadoMazo = res.data.estado;
      this.creadorMazo = res.data.usuarioCreador;
      this.nombreRevisor = res.data.nombreRevisor;
    });
    
    this.learnService.getObservacion(this.idMazo).subscribe((res) => {
      this.observacionRechazo = res.data.observacion;
    });
    
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddQuestionFlashcardComponent, {
      width: '80%',
      maxWidth: '500px',
      maxHeight: '80%',

      data: {id: this.idMazo},
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }

  emitSearch(res: any) {
    if (res) {
      this.searchInfo = res;
    }
  }
  reloadTable: boolean = false;
cantQuestions: number = 0;

  loadTable() {
    this.reloadTable = true;
  }

  loadedTale() {
    this.reloadTable = false;
  }
  
  canAprove() {
    return this.rol === 'Docente' && this.nombreRevisor === this.nombreUsuario && this.estadoMazo != 'Aprobado' && this.estadoMazo != 'Rechazado';
  }

  canPublish(){
    if(this.rol === 'Docente'){
      this.statusPublish = 2;
    }
    else{
      this.statusPublish = 1;
    }
    return this.creadorMazo === this.nombreUsuario && (this.estadoMazo !== 'Aprobado' && this.estadoMazo !== 'Ingresado');
  }

  canCreate(){
    const Estudiante = this.rol === 'Estudiante' && this.estadoMazo !== 'Aprobado';
    const Docente = this.rol === 'Docente' && this.creadorMazo=== this.nombreUsuario;
    return Estudiante || Docente;
  }

  // publishMazo(idStatus: number){
    
  //   const mazo: updateStatusMazo = {
  //     idMazo: this.idMazo,
  //     idEstado: idStatus
    
  //   };
  //   this.learnService.publicarMazo(mazo).subscribe((res) => {
  //     this.router.navigate(['/learn/flashcards']);
  //   });
  // }

  publishMazo(idStatus: number){
    
    const mazo: updateStatusMazo = {
      idMazo: this.idMazo,
      idEstado: idStatus
    
    };
    this.learnService.publicarMazo(mazo).subscribe((res) => {
      this.router.navigate(['/learn/flashcards']);
    });
  }

  reprobarMazo() {
    this.dialog.open(ObservacionRechazoComponent, {
      width: '40%',
      maxHeight: '80%',
      data: {id: this.idMazo, opcion:'mazo'},
    });
  }

  viewObservation(){
    this.dialog.open(ObservacionRechazoComponent, {
      width: '40%',
      maxHeight: '80%',
      data: {id: this.idMazo, opcion:'verObservacionMazo'},
    });
  }

  canViewObservation(){
    return this.rol ==='Estudiante' && this.observacionRechazo !== null;
  }


}
