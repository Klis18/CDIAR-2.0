import { Component, Input, inject } from '@angular/core';
import { LearnService } from '../../services/learn.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddQuestionFlashcardComponent } from '../../components/add-question-flashcard/add-question-flashcard.component';
import { HomeService } from '../../../home/services/home.service';
import { updateStatusMazo } from '../../interfaces/mazo.interface';
import { ObservacionRechazoComponent } from '../../components/observacion-rechazo/observacion-rechazo.component';

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

  private homeService = inject(HomeService);
  
  constructor(private learnService: LearnService,
              public dialog: MatDialog, 
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
      console.log(res);
      this.observacionRechazo = res.data.observacion;
    });
    
  }

  openDialog() {
    this.dialog.open(AddQuestionFlashcardComponent, {
      width: '50%',
      maxHeight: '80%',
      data: {id: this.idMazo},
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
    return this.rol === 'Docente' && this.nombreRevisor === this.nombreUsuario && this.estadoMazo != 'Aprobado' && this.estadoMazo != 'Rechazado';
  }

  canPublish(){
    return this.creadorMazo === this.nombreUsuario && (this.estadoMazo !== 'Aprobado' && this.estadoMazo !== 'Ingresado');
  }

  canCreate(){
    const Estudiante = this.rol === 'Estudiante' ;
    const Docente = this.rol === 'Docente' && this.creadorMazo=== this.nombreUsuario;
    return Estudiante || Docente;
  }

  publishMazo(idStatus: number){
    const mazo: updateStatusMazo = {
      idMazo: this.idMazo,
      idEstado: idStatus
    
    };
    this.learnService.publicarMazo(mazo).subscribe((res) => {
      console.log(res);
    });
  }

  reprobarMazo() {
    this.dialog.open(ObservacionRechazoComponent, {
      width: '40%',
      maxHeight: '80%',
      data: {id: this.idMazo},
    });
  }

  viewObservation(){
    this.observationVisible = true;
  }

  canViewObservation(){
    return this.rol ==='Estudiante' && this.observacionRechazo !== null;
  }
}
