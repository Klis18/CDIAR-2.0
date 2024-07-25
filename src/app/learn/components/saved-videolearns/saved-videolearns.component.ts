import { Component, EventEmitter, Inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ROLES } from '../../../academic-resources/interfaces/roles.interface';
import { SelectRevisorComponent } from '../../../control/components/select-revisor/select-revisor.component';
import { AsignarRevisorComponent } from '../../../control/pages/asignar-revisor/asignar-revisor.component';
import { HomeService } from '../../../home/services/home.service';
import { CardConfirmComponent } from '../../../shared/pages/card-confirm/card-confirm.component';
import { typeTable } from '../../interfaces/mazo.interface';
import { ListVideolearn, videoLearnsRealizedGetQuerys } from '../../interfaces/videolearn.interface';
import { VideolearnComponent } from '../../pages/videolearn/videolearn.component';
import { VideolearnService } from '../../services/videolearn.service';
import { EditVideolearnComponent } from '../edit-videolearn/edit-videolearn.component';
import { ObservacionRechazoComponent } from '../observacion-rechazo/observacion-rechazo.component';
import { VideolearnDetailsComponent } from '../videolearn-details/videolearn-details.component';

@Component({
  selector: 'saved-videolearns',
  templateUrl: './saved-videolearns.component.html',
  styles: ``
})
export class SavedVideolearnsComponent {
  @Input() filterByUser: string = '';
  @Input() filterByStatus: string = '';
  @Input() filterByRevisor: string = '';
  @Input() typeTable!: typeTable;
  @Input() searchData: any;
  @Input() loadTable: boolean = false;
  @Output() loadedTableEmitter = new EventEmitter<boolean>();
  data: ListVideolearn[] = [];
  itemsPerPage: number = 5;
  totalPages: number = 1;
  selectedTab = this.videolearn.selectedTab;
  selectedTab2 = this.approve.selectedTab;
  nombreVideoLearn: string = '';
  nivel: string = '';
  asignatura: string = '';
  docenteRevisor: string = '';
  nombreRevisor: string = '';
  usuarioCreador: boolean = true;
  match: any;
  enlaceVideoLearn: string = '';
  videoId: string | null = '';
  limitsOptions = [
    {
      label: '5',
      value: 5,
    },
    {
      label: '10',
      value: 10,
    },
    {
      label: '15',
      value: 15,
    },
  ];
  private idAsignatura!: number;
  private idNivel!: number;
  public page!: number;
  public limit: number = 5;
  public paginateCurrent: number[] = [];
  mensaje: string = '';
  tituloMazo: string = '';
  usuario: string = '';
  videolearns!: FormGroup;
  creadorSimulador: string = '';

  colors = ['#8B7CC0', '#924294', '#2E90A8', '#73C5D3', '#4581BA', '#5BC9D7', '#6C3EB1']; 


  constructor(private videolearnService:VideolearnService,
              private dialog: MatDialog,
              private router: Router,
              private videolearn: VideolearnComponent,
              @Inject(AsignarRevisorComponent) private approve: AsignarRevisorComponent,
              @Inject(HomeService) private homeService: HomeService,
              @Inject(FormBuilder) private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.builderForm();
    this.getDataMenu();
    this.videolearns.valueChanges.subscribe({
      next: (res) => {
        if (res?.limit) {
          this.limit = Number(res?.limit);
        }
        if (res?.page) {
          this.page = Number(res?.page);
        }
        this.listaVideoLearns();
      },
    });
    this.listaVideoLearns();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchData']) {
      this.idAsignatura = this.searchData?.asignaturas;
      this.idNivel = this.searchData?.nivelesType;
      this.nombreVideoLearn = this.searchData?.descripcion;
      this.listaVideoLearns();
    }
    if (changes['loadTable']) {
      if (this.loadTable) {
        this.listaVideoLearns();
      }
    }
  }
  pagination = {
    buttonLeft: true,
    buttonRight: true,
  };
  builderForm() {
    this.videolearns = this.formBuilder.group({
      limit: [5],
      page: [1],
    });
    this.limit = this.videolearns.get('limit')?.value;
    this.page = this.videolearns.get('page')?.value;
  }

  goToPage(event: Event) {
    const target = event.target as HTMLInputElement;
    let page = parseInt(target.value, 10);
    if (!isNaN(page) && page >= 1 && page <= this.paginateCurrent.length) {
      this.page = page;
      this.listaVideoLearns();
    } else {
      target.value = this.page.toString();
      this.listaVideoLearns();
    }
  }
 

  public userRol!: string;
  getDataMenu() {
    this.homeService.obtenerDatosMenu().subscribe((user) => {
      this.usuario = user.data.userName;
      this.userRol = user.data.rol;
    });
  }
  private idEstado!: number;
  listaVideoLearns() {
    const paginate: videoLearnsRealizedGetQuerys= {
      pages: this.page,
      limit: this.limit,
      idAsignatura: this.idAsignatura,
      idNivel: this.idNivel,
      nombreVideoLearn: this.nombreVideoLearn,
    
    };
    
    this.videolearnService.getVideoLearnsSavers(paginate).subscribe({
      next: (res: any) => {
        this.data = res.data ?? [];
        if (this.data.length > 0) {
          this.nombreVideoLearn = res.data.nombreVideoLearn;
          this.nivel = res.data.nivel;
          this.asignatura = res.data.asignatura;
          this.docenteRevisor = res.data.nombreDocenteRevisor;
          this.creadorSimulador = res.data.usuarioCreador;
          this.enlaceVideoLearn = res.data.enlaceVideo;
          this.paginateCurrent = this.crearArreglo(this.limit, res.numRecord);
        }
        if (this.data?.length === 0 || !this.data) {
          this.paginateCurrent = [1];
        }
      },
      complete: () => {
        this.loadedTableEmitter.emit(false);
      },

    });
  };


  //--------------VIDEOLEARNS REALIZADOS---------------

  getServiceVideoLearnRealizados() {
    const paginate: videoLearnsRealizedGetQuerys= {
      pages: this.page,
      limit: this.limit,
      idAsignatura: this.idAsignatura,
      idNivel: this.idNivel,
      nombreVideoLearn: this.nombreVideoLearn,
    
    };

    this.videolearnService.getVideoLearnsRealized(paginate).subscribe({
      next: (res: any) => {
        this.data = res.data ?? [];
        console.log('data', this.data);
        if (this.data.length > 0) {
          this.nombreVideoLearn = res.data.nombreVideoLearn;
          this.nivel = res.data.nivel;
          this.asignatura = res.data.asignatura;
          this.docenteRevisor = res.data.nombreDocenteRevisor;
          this.creadorSimulador = res.data.usuarioCreador;
          this.enlaceVideoLearn = res.data.enlaceVideo;
          this.paginateCurrent = this.crearArreglo(this.limit, res.numRecord);
        }
        if (this.data?.length === 0 || !this.data) {
          this.paginateCurrent = [1];
        }
      },
      complete: () => {
        this.loadedTableEmitter.emit(false);
      },

    });
  }

  //------------FIN VIDEOLEARN REALIZADOS----------------

  obtenerIDYoutube(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
        return match[2]; 
    } else {
        return null;
    }
  }



  crearArreglo(limite: number, cant: number) {
    const rest = cant / limite;
    const elementos = Math.floor(rest);
    const arreglo = [];
    const more = rest - elementos;
    for (let i = 1; i <= elementos; i++) {
      arreglo.push(i);

      if (more > 0 && elementos === i) {
        arreglo.push(i + 1);
      }
      this.pagination.buttonLeft = true;
      this.pagination.buttonRight = true;
    }
    
    if (elementos > 0) {
      if (arreglo?.length === this.page) {
        this.pagination.buttonRight = false;
      }
      if (1 === this.page) {
        this.pagination.buttonLeft = false;
      }
    }

    if (elementos === 0) {
      this.pagination.buttonLeft = false;
      this.pagination.buttonRight = false;
      arreglo.push(1);
    }
    return arreglo;
  }

  openDialog(message: string) {
    return this.dialog.open(CardConfirmComponent, {
      data: {
        mensaje: message,
      },
      width: '30%',
    });
  }

  eliminarVideolearn(idVideoLearn: number) {
    const dialogRef = this.openDialog(
      '¿Estás seguro de eliminar este videolearn?'
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.videolearnService.deleteVideolearn(idVideoLearn).subscribe(() => {
          this.listaVideoLearns();
        });
      }
    });
  }

  prevPage() {
    if (this.pagination.buttonLeft) {
      const leftButton = this.videolearns.get('page')?.value;
      this.videolearns.get('page')?.setValue(leftButton - 1);
    }
  }

  nextPage() {
    if (this.pagination.buttonRight) {
      const rightButton = this.videolearns.get('page')?.value;
      this.videolearns.get('page')?.setValue(rightButton + 1);
    }
  }

  canApprove(item: any): boolean {
    let isReviewer = false;
    if (this.userRol === ROLES.DOCENTE) {
      isReviewer =
        item.docenteRevisor == this.usuario &&
        this.selectedTab === 'Por Aprobar' &&
        item.estado != 'Aprobado';
    }
    return isReviewer;
  }

  canEdit(item: any): boolean {
    let condition1 = (this.selectedTab === 'Mis VideoLearns' && ( item.estado === 'Ingresado' || item.estado === 'Privado') && item.nombreDocenteRevisor === '');
    let condition2 = (this.selectedTab === 'Mis VideoLearns' && item.estado ==='Rechazado' ) ;
    let condition3 = (this.selectedTab === 'Mis VideoLearns' && this.userRol ===ROLES.DOCENTE);
    return condition1 || condition2 || condition3 ;
  }

  canDelete(item: any) {
    const estudiante = (this.selectedTab === 'Mis VideoLearns' &&( item.estado === 'Ingresado' || item.estado === 'Privado') && item.nombreDocenteRevisor === '');
    const docente = (this.selectedTab === 'Mis VideoLearns' && this.userRol === ROLES.DOCENTE );
    return estudiante || docente;
  }

  canStartSimulator(){
    const tab = this.selectedTab !== 'Por Aprobar';
    const isAdmin = this.userRol !== ROLES.ADMIN;
    return tab && isAdmin;
  }

  editarVideoLearn(idVideoLearn: number, item: any) {
    const dialogRef = this.dialog.open(EditVideolearnComponent, {
      width: '40%',
      maxHeight: '80%',
      data: {
        id: idVideoLearn,
        typeModal: this.typeTable,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaVideoLearns();
      }
    });
  }

  getGradient(index: number) {
    const color1 = this.colors[index % this.colors.length];
    const color2 = this.colors[(index + 1) % this.colors.length];
    return `linear-gradient(to right, ${color1} 0%, ${color2} 100%)`;
  }

  getCover(url:string){
    const id = this.obtenerIDYoutube(url);
    const imagen= `https://img.youtube.com/vi//${id}/hqdefault.jpg`;
    return imagen
  }
  
  viewDetailsVideolearn(item: any) {
    this.dialog.open(VideolearnDetailsComponent, {
      width: '32%',
      data: {id: item.idVideoLearn},
    });
  }

  redirigirPreguntas(item: ListVideolearn) {
    this.router.navigate(['/learn/preguntas-videolearn',{id: item.idVideoLearn, videolearn: item.nombreVideoLearn}]);
  }

  redirigirIniciarVideoLearn(item: ListVideolearn) {
    this.saveVideoLearnStarted(item.idVideoLearn);
    this.router.navigate(['/learn/iniciar-videolearn',{id: item.idVideoLearn, videolearn: item.nombreVideoLearn}]);
  }

  
  asignaRevisor(idVideolearn: number) {
    const dialogRef = this.dialog.open(SelectRevisorComponent, {
      width: '80%',
      data: {id: idVideolearn, opcion:'VideoLearns'},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaVideoLearns();
      }
    });
  }

  saveVideoLearnToReview(idVideoLearn: number) {
    this.videolearnService.SaveVideoLearnToReview(idVideoLearn).subscribe(() => {
        console.log('Videolearn guardado');
    });
  }

  saveVideoLearnStarted(idVideoLearn: number) {
    this.videolearnService.saveVideoLearnStarted(idVideoLearn).subscribe(() => {
      console.log('Videolearn iniciado guardado');
    });
  }

  verObservacion(idVideoLearn: number) {
    this.dialog.open(ObservacionRechazoComponent, {
      width: '55%',
      maxHeight: '90%',
      data: {id: idVideoLearn, opcion: 'verObservacionVideolearn'},
    });
  }
}
