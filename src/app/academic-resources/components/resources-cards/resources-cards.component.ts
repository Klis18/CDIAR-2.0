import { Component, EventEmitter, Inject, Input, Output, SimpleChanges } from '@angular/core';
import { RecursoService } from '../../services/recurso.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SelectRevisorComponent } from '../../../control/components/select-revisor/select-revisor.component';
import { AsignarRevisorComponent } from '../../../control/pages/asignar-revisor/asignar-revisor.component';
import { HomeService } from '../../../home/services/home.service';
import { CardConfirmComponent } from '../../../shared/pages/card-confirm/card-confirm.component';
import { typeTable, ListaRecurso, RecursosGetQuery, RecursosIdEstados, EstadosRecursos } from '../../interfaces/recurso.interface';
import { ROLES } from '../../interfaces/roles.interface';
import { ResourcesComponent } from '../../pages/resources/resources.component';
import { EditResourceComponent } from '../edit-resource/edit-resource.component';
import { ResourceDetailsComponent } from '../resource-details/resource-details.component';
import { ObservacionRechazoComponent } from '../../../shared/pages/observacion-rechazo/observacion-rechazo.component';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { CardMessageComponent } from '../../../shared/pages/card-message/card-message.component';

@Component({
  selector: 'resources-cards',
  templateUrl: './resources-cards.component.html',
  styles: ``
})
export class ResourcesCardsComponent {
  @Input() filterByUser: string = '';
  @Input() typeTable!: typeTable;
  @Input() searchData: any;
  @Input() loadTable: boolean = false;
  @Output() loadedTableEmitter = new EventEmitter<boolean>();
  colors = ['#E0C94C','#E04CB9','#4CE0E0','#E071A0','#993ED6', '#8593E1','#8593E1']; 

  data: ListaRecurso[] = [];
  itemsPerPage: number = 5;
  totalPages: number = 1;
  selectedTab = this.academic.selectedTab;
  selectedTab2 = this.approve.selectedTab;
  nombreRecurso: string = '';
  nivel: string = '';
  asignatura: string = '';
  private idAsignatura!: number;
  private idNivel!: number;
  private descripcion!: string;
  public page!: number;
  public limit: number = 5;
  public paginateCurrent: number[] = [];
  mensaje: string = '';
  tituloRecurso: string = '';
  usuario: string = '';
  resourceTable!: FormGroup;
  limitsOptions = [
    {
      label: '10',
      value: 10,
    },
    {
      label: '15',
      value: 15,
    },
    {
      label: '20',
      value: 20,
    },
  ];

  constructor(
    private recursoService: RecursoService,
    private academic: ResourcesComponent,
    private spinnerService: SpinnerService,
    @Inject(AsignarRevisorComponent) private approve: AsignarRevisorComponent,
    @Inject(HomeService) private homeService: HomeService,
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {}
  public iconActionTable: string = '';
  public userRol!: string;
  private idEstado!: number;
  pagination = {
    buttonLeft: false,
    buttonRight: false,
  };

  ngOnInit(): void {
    this.getDataMenu();
    this.builderForm();

    this.resourceTable.valueChanges.subscribe({
      next: (res) => {
        if (res?.limit) {
          this.limit = Number(res?.limit);
        }
        if (res?.page) {
          this.page = Number(res?.page);
        }
        this.listaRecursos();
      },
    });
    switch (this.typeTable) {
      case 'Por Aprobar':
        this.tituloRecurso = 'Aprobar Recurso';
        this.iconActionTable = 'assignment_turned_in';
        break;

      default:
        this.tituloRecurso = 'Editar Recurso';
        this.iconActionTable = 'edit';
        break;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchData']) {
      this.idAsignatura = this.searchData?.asignaturas;
      this.idNivel = this.searchData?.nivelesType;
      this.descripcion = this.searchData?.descripcion;
      this.listaRecursos();
    }
    if (changes['loadTable']) {
      if (this.loadTable) {
        this.listaRecursos();
      }
    }
  }

  builderForm() {
    this.resourceTable = this.formBuilder.group({
      limit: [10],
      page: [1],
    });
    this.limit = this.resourceTable.get('limit')?.value;
    this.page = this.resourceTable.get('page')?.value;
  }

  getDataMenu() {
    this.homeService.obtenerDatosMenu().subscribe({
      next: (user) => {
        this.usuario = user.data.userName;
        this.userRol = user.data.rol;
        this.listaRecursos();
      },
    });
  }
  listaRecursos() {
    const paginate: RecursosGetQuery = {
      page: this.page,
      limit: this.limit,
      idAsignatura: this.idAsignatura,
      idNivel: this.idNivel,
      descripcion: this.descripcion,
      idEstado: this.idEstado,
    };
    if (this.typeTable === 'Mis Recursos') {
      delete paginate.idEstado;
    }
    if (this.typeTable === 'Publicado') {
      paginate.idEstado = RecursosIdEstados.APROBADO;
    }
    if (this.typeTable === 'Por Aprobar' && this.userRol === 'Docente') {
      paginate.revisor = true;
      paginate.idEstado = RecursosIdEstados.INGRESADO;
    }
    if (this.typeTable === 'Asignar Revisor') {
      paginate.idEstado = RecursosIdEstados.INGRESADO;
    }

    if (this.typeTable !== 'Recursos revisados') {
      this.getServiceRecursos(paginate);
    }

    if (this.typeTable === 'Recursos revisados') {
      this.getServiceRecursosReviewed(paginate);
    }
  }

  getServiceRecursos(paginate: RecursosGetQuery) {
    this.recursoService.getRecursos(paginate).subscribe({
      next: (res: any) => {
        let currentData: any[] = [];

        if (res?.data) {
          currentData = res?.data.filter((d: any) => {
            if (this.typeTable === 'Asignar Revisor') {
              if (d?.docenteRevisor === '') {
                return d;
              }
            } else {
              return d;
            }
          });
        }
        this.data = currentData;
        if (this.data.length > 0) {
          this.nombreRecurso = res.data.nombreRecurso;
          this.nivel = res.data.nivel;
          this.asignatura = res.data.asignatura;
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

  getServiceRecursosReviewed(paginate: RecursosGetQuery) {
    this.recursoService.getRecursosReviewed(paginate).subscribe({
      next: (res: any) => {
        let currentData: any[] = [];

        if (res?.data) {
          currentData = res?.data.filter((d: any) => {
            if (this.typeTable === 'Asignar Revisor') {
              if (d?.docenteRevisor === '') {
                return d;
              }
            } else {
              return d;
            }
          });
        }
        this.data = currentData;
        if (this.data.length > 0) {
          this.nombreRecurso = res.data.nombreRecurso;
          this.nivel = res.data.nivel;
          this.asignatura = res.data.asignatura;
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

  clickFileLink(item: any) {
    this.recursoService.setRevisionResource(item?.idRecurso).subscribe({
      next: (res) => {
        if (res) {
        }
      },
      complete: () => {
        this.listaRecursos();
      },
    });
  }

  openFileInTab(item: any): string {
    let urlRecurso: string = '';

    if (item.tipoRecurso === 'Link') {
      urlRecurso = item.enlaceRecurso;
    } else if (
      item.tipoRecurso === 'Archivo' ||
      item.tipoRecurso === 'Imagen'
    ) {
      urlRecurso = item.recurso;
    }

    return urlRecurso;
  }

  getFilterByStatus(statusName: EstadosRecursos) {
    const StatesByResources = [
      {
        label: EstadosRecursos.INGRESADO,
        value: RecursosIdEstados.INGRESADO,
      },
      {
        label: EstadosRecursos.APROBADO,
        value: RecursosIdEstados.APROBADO,
      },
      {
        label: EstadosRecursos.RECHAZADO,
        value: RecursosIdEstados.RECHAZADO,
      },
      {
        label: EstadosRecursos.ELIMINADO,
        value: RecursosIdEstados.RECHAZADO,
      },
    ];
    const find = StatesByResources.find((state) => state.label === statusName);

    return find!.value;
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
      width: '80%',
      maxWidth: '500px',
      maxHeight: '80%',

      data: {
        mensaje: message,
      },
    });
  }

  eliminarRecurso(idRecurso: number) {
    const dialogRef = this.openDialog(
      '¿Estás seguro de eliminar este recurso?'
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.spinnerService.showSpinner();
        this.recursoService.eliminarRecurso(idRecurso).subscribe(() => {
          this.spinnerService.hideSpinner();
          this.listaRecursos();
        },
        (error) => {
            this.spinnerService.hideSpinner();
            this.dialog.open(CardMessageComponent, {
              width: '80%',
              maxWidth: '500px',
              maxHeight: '80%',
              data: {status:'error', mensaje: 'Error al eliminar el recursos, por favor intente de nuevo.'},
            });
          });
      }
    });
  }

  prevPage() {
    if (this.pagination.buttonLeft) {
      const leftButton = this.resourceTable.get('page')?.value;
      this.resourceTable.get('page')?.setValue(leftButton - 1);
      this.listaRecursos();
    }
  }

  nextPage() {
    if (this.pagination.buttonRight) {
      const rightButton = this.resourceTable.get('page')?.value;
      this.resourceTable.get('page')?.setValue(rightButton + 1);
      this.listaRecursos();
    }
  }

  goToPage(event: Event) {
    const target = event.target as HTMLInputElement;
    let page = parseInt(target.value, 10);
    if (!isNaN(page) && page >= 1 && page <= this.paginateCurrent.length) {
      this.page = page;
      this.listaRecursos();
    } else {
      target.value = this.page.toString();
      this.listaRecursos();
    }
  }
 

  getIcon(tipoRecurso: string) {
    switch (tipoRecurso) {
      case 'Archivo':
        return 'assets/images/papel.png';
      case 'Link':
        return 'assets/images/enlace.png';
      case 'Imagen':
        return 'assets/images/galeria-de-imagenes.png';
      default:
        return '';
    }
  }

  canDelete(item: any) {
    const estudiante = (this.selectedTab === 'Mis Recursos' && item.estadoRecurso === 'Ingresado' && item.usuarioCreacion == this.usuario && item.docenteRevisor === '');
    const docente = (this.selectedTab === 'Mis Recursos' && this.userRol === ROLES.DOCENTE );
    return estudiante || docente;
  }


  canEdit(item: any): boolean {
    let status: boolean = false;
    let condition1 = (this.selectedTab === 'Mis Recursos' && item.estadoRecurso === 'Ingresado' && item.usuarioCreacion == this.usuario && item.docenteRevisor === '');
    let condition2 = (this.selectedTab === 'Mis Recursos' && item.estadoRecurso ==='Rechazado' ) ;
    let condition3 = (this.selectedTab === 'Mis Recursos' && this.userRol ===ROLES.DOCENTE);
    return condition1 || condition2 || condition3;
  }

  editarRecurso(idRecurso: number) {
    const dialogRef = this.dialog.open(EditResourceComponent, {
      width: '80%',
      maxWidth: '500px',
      maxHeight: '80%',
      data: {
        id: idRecurso,
        titulo: this.tituloRecurso,
        typeModal: this.typeTable,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaRecursos();
      }
    });
  }


  asignaRevisor(idRecurso: number) {
    const dialogRef = this.dialog.open(SelectRevisorComponent, {
      width: '80%',
      data: {id: idRecurso, opcion:'Recursos'},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaRecursos();
      }
    });
  }

  getGradient(index: number) {
    const color1 = this.colors[index % this.colors.length];
    const color2 = this.colors[(index + 1) % this.colors.length];
    return `linear-gradient(to right, ${color1} 0%, ${color2} 100%)`;
  }

  viewDetailsResource(item: any, opcion: string) { 
   const dialogRef = this.dialog.open(ResourceDetailsComponent, {
    width: '80%',
    maxWidth: '500px',
    maxHeight: '80%',
      data: {id: item.idRecurso, 
            nivel:item.nivel, 
            asignatura:item.asignatura,
            opcion:opcion},
    });
    dialogRef.afterClosed().subscribe((result) => {
        this.listaRecursos();
    });
  }

  newNotify(item: any) {
    let currentDate = new Date();
    let fechaCreacion = new Date(item.fechaCreacion);
    let diferenciaEnMs = currentDate.getTime() - fechaCreacion.getTime();
    let diferenciaEnDias = Math.floor(diferenciaEnMs / (1000 * 60 * 60 * 24));
    if (diferenciaEnDias < 5) {
      return true;
    }
    else{
      return false;
    }
  }

  verObservacion(idRecurso: number) {
    this.dialog.open(ObservacionRechazoComponent, {
      width: '80%',
      maxWidth: '500px',
      maxHeight: '80%',
      data: {id: idRecurso, opcion: 'verObservacionRecurso'},
    });
  }
}
