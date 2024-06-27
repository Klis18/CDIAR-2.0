import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { EstadoRecursosType, EstadosRecursos, ListaRecurso, RecursosGetQuery, RecursosIdEstados, typeTable } from '../../interfaces/recurso.interface';
import { RecursoService } from '../../services/recurso.service';
import { HomeService } from '../../../home/services/home.service';
import { MatDialog} from '@angular/material/dialog';
import { CardConfirmComponent } from '../../../shared/pages/card-confirm/card-confirm.component';
import { EditResourceComponent } from '../edit-resource/edit-resource.component';
import { ResourcesComponent } from '../../pages/resources/resources.component';
import { AsignarRevisorComponent } from '../../../control/pages/asignar-revisor/asignar-revisor.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ROLES } from '../../interfaces/roles.interface';
import { ListRevisorComponent } from '../../../control/components/list-revisor/list-revisor.component';
import { SelectRevisorComponent } from '../../../control/components/select-revisor/select-revisor.component';

@Component({
  selector: 'resources-table',
  templateUrl: './resources-table.component.html',
  styles: `
    :host ::ng-deep .mat-badge-content.mat-badge-active {
    background-color: #1e3a8a !important;
    border-radius: 20px !important;
    padding: 2px 3px !important;
    line-height: normal !important;
    font-weight: 500;
    height: auto !important;
    width: auto;
    font-size: 11px;
  }
  `,
})
export class ResourcesTableComponent implements OnInit, OnChanges{
  @Input() filterByUser: string = '';
  @Input() typeTable!: typeTable;
  @Input() searchData: any;
  @Input() loadTable: boolean = false;
  @Output() loadedTableEmitter = new EventEmitter<boolean>();
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

  constructor(
    private recursoService: RecursoService,
    private academic: ResourcesComponent,
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

      // case 'Asignar Revisor':
      //   this.tituloRecurso = 'Asignar Revisor';
      //   this.iconActionTable = 'perm_contact_calendar';
      //   break;

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
      limit: [5],
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
      data: {
        mensaje: message,
      },
      width: '30%',
    });
  }

  eliminarRecurso(idRecurso: number) {
    const dialogRef = this.openDialog(
      '¿Estás seguro de eliminar este recurso?'
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.recursoService.eliminarRecurso(idRecurso).subscribe(() => {
          this.listaRecursos();
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

  changePage(newPage: number) {
    if (newPage !== this.page) {
      this.resourceTable.get('page')?.setValue(newPage);
      this.page = newPage;
      this.listaRecursos();
    }
  }

  getStyleColor(tipoRecurso: string) {
    switch (tipoRecurso) {
      case 'Archivo':
        return 'bg-cyan-700';
      case 'Link':
        return 'bg-orange-600';
      case 'Imagen':
        return 'bg-pink-700';
      default:
        return '';
    }
  }

  getIcon(tipoRecurso: string) {
    switch (tipoRecurso) {
      case 'Archivo':
        return 'insert_drive_file';
      case 'Link':
        return 'insert_drive_file';
      case 'Imagen':
        return 'image';
      default:
        return '';
    }
  }

  canApprove(item: any): boolean {
    let isReviewer = false;
    if (this.userRol === ROLES.DOCENTE) {
      isReviewer =
        item.docenteRevisor == this.usuario &&
        this.selectedTab === 'Por Aprobar' &&
        item.estadoRecurso != 'Aprobado';
    }

    return isReviewer;
  }

  canDelete(item: any) {
    const first = item.usuarioCreacion == this.usuario;
    const second = this.selectedTab === 'Mis Recursos';
    const three =
      item.estadoRecurso !== 'Aprobado' && item.estadoRecurso !== 'Eliminado';

    const fourth = item.docenteRevisor === '';

    return first && second && three && fourth;
  }

  viewNotify(element: any) {
    if (element?.recursoRevisadoDato) return '';

    return 'nuevo';
  }

  canResolveReject(item: any) {
    let status: boolean = false;
    if (item.estadoRecurso === 'Rechazado') {
      status =
        item.usuarioCreacion == this.usuario &&
        this.selectedTab === 'Mis Recursos' &&
        item.docenteRevisor;
    }
    return status;
  }

  canEdit(item: any): boolean {
    let status: boolean = false;

    switch (this.userRol) {
      case 'Estudiante':
        if (this.selectedTab === 'Mis Recursos') {
          if (item.estadoRecurso === 'Ingresado') {
            status =
              item.usuarioCreacion == this.usuario &&
              item.docenteRevisor === '';
          }
        }

        break;
      case 'Docente':
        if (this.selectedTab === 'Mis Recursos') {
          status =
            item.usuarioCreacion == this.usuario &&
            item.estadoRecurso !== 'Aprobado' &&
            item.docenteRevisor === '';
        }

        if (this.selectedTab === 'Por Aprobar') {
          status =
            item.estadoRecurso !== 'Aprobado' && item.docenteRevisor !== '';
        }
        break;
      // case 'Admin':
      //   status =
      //     item.docenteRevisor === '' &&
      //     item.estadoRecurso !== 'Aprobado' &&
      //     this.selectedTab2 === 'Recursos Académicos';
      //   break;
    }

    return status;
  }

  editarRecurso(idRecurso: number) {
    const dialogRef = this.dialog.open(EditResourceComponent, {
      width: '80%',
      maxWidth: '420px',
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

  corregirRecurso(idRecurso: number) {
    const dialogRef = this.dialog.open(EditResourceComponent, {
      width: '80%',
      maxWidth: '420px',
      data: {
        id: idRecurso,
        titulo: 'Corregir Recurso',
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
}
      