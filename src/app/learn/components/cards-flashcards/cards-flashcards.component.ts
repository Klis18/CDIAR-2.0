import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ListMazo, MazosGetQuery, typeTable } from '../../interfaces/mazo.interface';
import { LearnService } from '../../services/learn.service';
import { MatDialog } from '@angular/material/dialog';
import { DetailsMazoComponent } from '../details-mazo/details-mazo.component';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AsignarRevisorComponent } from '../../../control/pages/asignar-revisor/asignar-revisor.component';
import { HomeService } from '../../../home/services/home.service';
import { FlashcardsComponent } from '../../pages/flashcards/flashcards.component';
import { CardConfirmComponent } from '../../../shared/pages/card-confirm/card-confirm.component';
import { ROLES } from '../../../shared/interfaces/roles.interface';
import { Estados, IdEstados } from '../../../shared/interfaces/estados.interface';
import { EditMazoComponent } from '../edit-mazo/edit-mazo.component';
import { ListRevisorComponent } from '../../../control/components/list-revisor/list-revisor.component';
import { SelectRevisorComponent } from '../../../control/components/select-revisor/select-revisor.component';
import { ObservacionRechazoComponent } from '../../../shared/pages/observacion-rechazo/observacion-rechazo.component';

interface DataItem {
  title: string;
  content: string;
}

@Component({
  selector: 'cards-flashcards',
  templateUrl: './cards-flashcards.component.html',
  styles: ``
})
export class CardsFlashcardsComponent implements OnInit, OnChanges{
  @Input() filterByUser: string = '';
  @Input() filterByStatus: string = '';
  @Input() filterByRevisor: string = '';
  @Input() typeTable!: typeTable;
  @Input() searchData: any;
  @Input() loadTable: boolean = false;
  @Output() loadedTableEmitter = new EventEmitter<boolean>();
  data: ListMazo[] = [];
  itemsPerPage: number = 5;
  totalPages: number = 1;
  selectedTab = this.mazo.selectedTab;
  selectedTab2 = this.approve.selectedTab;
  nombreMazo: string = '';
  nivel: string = '';
  asignatura: string = '';
  docenteRevisor: string = '';
  nombreRevisor: string = '';
  usuarioCreador: boolean = true;
  limitsOptions = [
    {
      label: '5 Elementos',
      value: 5,
    },
    {
      label: '10 Elementos',
      value: 10,
    },
    {
      label: '15 Elementos',
      value: 15,
    },
  ];
  private idAsignatura!: number;
  private idNivel!: number;
  private descripcion!: string;
  public page!: number;
  public limit: number = 5;
  public paginateCurrent: number[] = [];
  mensaje: string = '';
  tituloMazo: string = '';
  usuario: string = '';
  flashCards!: FormGroup;
  creadorMazo: string = '';
  generado: boolean = false;

  colors = ['#67E8A2', '#67E8DA', '#C883F1', '#CB48A0', '#7FCDE8', '#2E95A3', '#E8BB7F']; 


  constructor(private learnService:LearnService,
              private dialog: MatDialog,
              private router: Router,
              private mazo: FlashcardsComponent,
              @Inject(AsignarRevisorComponent) private approve: AsignarRevisorComponent,
              @Inject(HomeService) private homeService: HomeService,
              @Inject(FormBuilder) private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.builderForm();
    this.getDataMenu();
    this.flashCards.valueChanges.subscribe({
      next: (res) => {
        if (res?.limit) {
          this.limit = Number(res?.limit);
        }
        if (res?.page) {
          this.page = Number(res?.page);
        }
        this.listaMazos();
      },
    });
    this.listaMazos();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchData']) {
      this.idAsignatura = this.searchData?.asignaturas;
      this.idNivel = this.searchData?.nivelesType;
      this.nombreMazo = this.searchData?.descripcion;
      this.listaMazos();
    }
    if (changes['loadTable']) {
      if (this.loadTable) {
        this.listaMazos();
      }
    }
  }
  pagination = {
    buttonLeft: true,
    buttonRight: true,
  };
  builderForm() {
    this.flashCards = this.formBuilder.group({
      limit: [5],
      page: [1],
    });
    this.limit = this.flashCards.get('limit')?.value;
    this.page = this.flashCards.get('page')?.value;
  }

  goToPage(event: Event) {
    const target = event.target as HTMLInputElement;
    let page = parseInt(target.value, 10);
    if (!isNaN(page) && page >= 1 && page <= this.paginateCurrent.length) {
      this.page = page;
      this.listaMazos();
    } else {
      target.value = this.page.toString();
      this.listaMazos();
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
  listaMazos() {
    const paginate: MazosGetQuery = {
      page: this.page,
      limit: this.limit,
      idAsignatura: this.idAsignatura,
      idNivel: this.idNivel,
      descripcion: this.nombreMazo,
      idEstado: this.idEstado,
      nombreDocenteRevisor: this.nombreRevisor,
      usuarioCreador: this.usuarioCreador,
    };
    if (this.typeTable === 'Mis Flashcards') {
      delete paginate.idEstado;
    }
    if (this.typeTable === 'Publicado') {
      paginate.usuarioCreador = false;
      paginate.idEstado = IdEstados.APROBADO;
    }
    if (this.typeTable === 'Por Aprobar') {
      paginate.usuarioCreador = false;
      paginate.idEstado = IdEstados.INGRESADO;
    }
    if(this.typeTable === 'Flashcards') {
      paginate.usuarioCreador = false;
      paginate.idEstado == IdEstados.INGRESADO && paginate.nombreDocenteRevisor == '' ;
    }

    if (this.filterByStatus) {
      const StatesByResources = [
        {
          label: Estados.INGRESADO,
          value: IdEstados.INGRESADO,
        },
        {
          label: Estados.APROBADO,
          value: IdEstados.APROBADO,
        },
        {
          label: Estados.RECHAZADO,
          value: IdEstados.RECHAZADO,
        },
        {
          label: Estados.ELIMINADO,
          value: IdEstados.RECHAZADO,
        },
      ];
      const find = StatesByResources.find(
        (state) => state.label === this.filterByStatus
      );
      if (find) paginate.idEstado = find.value;
    }
    if (this.filterByRevisor) {
      paginate.nombreDocenteRevisor = this.filterByRevisor;
    }
   
    this.learnService.getMazos(paginate).subscribe({
      next: (res: any) => {
        this.data = res.data ?? [];
        if (this.data.length > 0) {
          this.nombreMazo = res.data.nombreMazo;
          this.nivel = res.data.nivel;
          this.asignatura = res.data.asignatura;
          this.docenteRevisor = res.data.nombreDocenteRevisor;
          this.creadorMazo = res.data.usuarioCreador;
          this.generado = res.data.esIA;
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

  eliminarMazo(idMazo: number) {
    const dialogRef = this.openDialog(
      '¿Estás seguro de eliminar este mazo?'
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.learnService.deleteMazo(idMazo).subscribe(() => {
          this.listaMazos();
        });
      }
    });
  }

  prevPage() {
    if (this.pagination.buttonLeft) {
      const leftButton = this.flashCards.get('page')?.value;
      this.flashCards.get('page')?.setValue(leftButton - 1);
    }
  }

  nextPage() {
    if (this.pagination.buttonRight) {
      const rightButton = this.flashCards.get('page')?.value;
      this.flashCards.get('page')?.setValue(rightButton + 1);
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
  // canEdit(item: any): boolean {
  //   const isCreator =
  //     item.usuarioCreacion == this.usuario &&
  //     this.selectedTab === 'Mis Flashcards' &&
  //     item.estado !== 'Aprobado' &&
  //     item.nombreRevisor == '';

  //   const isAdmin =
  //     item.docenteRevisor === '' &&
  //     item.estado != 'Aprobado' &&
  //     this.selectedTab2 === 'Flashcards';
  //   return isCreator || isAdmin;
  // }
  canEdit(item: any): boolean {
    let status: boolean = false;
    let condition1 = (this.selectedTab === 'Mis Flashcards' && ( item.estado === 'Ingresado' || item.estado === 'Privado') && item.nombreDocenteRevisor === '');
    let condition2 = (this.selectedTab === 'Mis Flashcards' && item.estado ==='Rechazado' ) ;
    let condition3 = (this.selectedTab === 'Mis Flashcards' && this.userRol ===ROLES.DOCENTE);
    // if (this.selectedTab === 'Mis Recursos') {
    //   if (item.estadoRecurso === 'Ingresado') {
    //     status =
    //       item.usuarioCreacion == this.usuario &&
    //       item.docenteRevisor === '';
    //   }
    // }
    return condition1 || condition2 || condition3;
  }

  canDelete(item: any) {
    const estudiante = (this.selectedTab === 'Mis Flashcards' &&( item.estado === 'Ingresado' || item.estado === 'Privado') && item.nombreDocenteRevisor === '');
    const docente = (this.selectedTab === 'Mis Flashcards' && this.userRol === ROLES.DOCENTE );
    return estudiante || docente;
  }

  editarMazo(idMazo: number, item: any) {
    if (this.canEdit(item)) {
      if (item.usuarioCreador == this.usuario) {
        this.tituloMazo = 'Editar Mazo';
      } else if (item.docenteRevisor == this.usuario) {
        this.tituloMazo = 'Aprobar Mazo';
      } else {
        this.tituloMazo = 'Asignar Revisor';
      }
    }
    const dialogRef = this.dialog.open(EditMazoComponent, {
      width: '40%',
      maxHeight: '80%',
      data: {
        id: idMazo,
        titulo: this.tituloMazo,
        typeModal: this.typeTable,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaMazos();
      }
    });
  }

  getGradient(index: number) {
    const color1 = this.colors[index % this.colors.length];
    const color2 = this.colors[(index + 1) % this.colors.length];
    return `linear-gradient(to right, ${color1} 0%, ${color2} 100%)`;
  }

  viewDetailsMazo(item: any) {
    
    this.dialog.open(DetailsMazoComponent, {
      width: '33%',
      data: {id: item.idMazo, nivel: item.nivel, asignatura: item.asignatura},
    });
  }

  redirigirPreguntas(item: ListMazo) {
    this.router.navigate(['/learn/preguntas',{id: item.idMazo, mazo: item.nombreMazo}]);
  }

  redirigirEstudiarFlashcards(item: ListMazo) {
    this.learnService.guardarMazoEstudiado(item.idMazo).subscribe((res) => {
      console.log('Mazo guardado', res.data);
      this.router.navigate(['/learn/estudiar-flashcards',{id: item.idMazo, mazo: item.nombreMazo}]);
    });
    // this.router.navigate(['/learn/estudiar-flashcards',{id: item.idMazo, mazo: item.nombreMazo}]);
  }

  canAssignRevisor(item:any){
    const noRevisor = item.nombreDocenteRevisor === '';
    const isAdmin = this.userRol === ROLES.ADMIN;
    return noRevisor && isAdmin;
  }

  asignaRevisor(idMazo: number) {
    const dialogRef = this.dialog.open(SelectRevisorComponent, {
      width: '80%',
      data: {id: idMazo, opcion:'Mazo'},
    });
    dialogRef.afterClosed().subscribe((result) => {
        this.listaMazos();
    });
  }

  saveMazoToReview(idMazo: number) {
    this.learnService.saveMazoToReview(idMazo).subscribe(() => {
      console.log('Mazo guardado para futura revisión');
    });
  }

  verObservacion(idMazo: number) {
    this.dialog.open(ObservacionRechazoComponent, {
      width: '55%',
      maxHeight: '90%',
      data: {id: idMazo, opcion: 'verObservacionMazo'},
    });
  }

  isGenerate(item:any){
    if(item.esIA === true){
      return true;
    }
    else{
      return false;
    }
  }
}
