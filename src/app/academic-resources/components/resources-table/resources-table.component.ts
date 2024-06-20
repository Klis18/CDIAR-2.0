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

@Component({
  selector: 'resources-table',
  templateUrl: './resources-table.component.html',
  styles: ``,
})
export class ResourcesTableComponent implements OnInit, OnChanges{
  // @Input() filterByUser: string = '';
  // @Input() filterByStatus: string = '';
  // @Input() filterByRevisor: string = '';
  // @Input() searchData: any;
  // data: ListaRecurso[] = [];
  // currentPage: number = 1;
  // itemsPerPage: number = 5;
  // totalPages: number = 1;
  // selectedTab = this.academic.selectedTab;
  // selectedTab2 = this.aprove.selectedTab;
  // nombreRecurso: string = '';
  // nivel: string = '';
  // asignatura: string = '';
  // limitsOptions = [
  //   {
  //     label: '5 Elementos',
  //     value: 5,
  //   },
  //   {
  //     label: '10 Elementos',
  //     value: 10,
  //   },
  //   {
  //     label: '15 Elementos',
  //     value: 15,
  //   },
  // ];
  // limit: number = 5;
  // mensaje: string = '';
  // tituloRecurso: string = '';
  // usuario: string = '';
  // resourceTable!: FormGroup;    
  
  // constructor(
  //   private recursoService: RecursoService,
  //   private academic: ResourcesComponent,
  //   @Inject(AsignarRevisorComponent) private aprove: AsignarRevisorComponent,
  //   @Inject(HomeService) private homeService: HomeService,
  //   @Inject(FormBuilder) private formBuilder: FormBuilder,
  //   private dialog: MatDialog
  // ) {}

  // ngOnChanges(changes: SimpleChanges) {
  //   console.log({ changes });
  //   if (changes['searchData']) {
  //     console.log('El valor del input ha cambiado:', this.searchData);
  //   }
  // }

  // openDialog(message: string) {
  //   return this.dialog.open(CardConfirmComponent, {
  //     data: {
  //       mensaje: message,
  //     },
  //     width: '30%',
  //   });
  // }


  // ngOnInit(): void {
  //   this.getDataMenu();
   
  //   this.listaRecursos();
  // }

  // listaRecursos() {
  //   this.recursoService.getRecursos().subscribe((res: any) => {
  //     console.log(res);
  //     this.data = res.data;
  //     this.nombreRecurso = res.data.nombreRecurso;
  //     this.nivel = res.data.nivel;
  //     this.asignatura = res.data.asignatura;
  //   });
  // }

  // getDataMenu(){
  //   this.homeService.obtenerDatosMenu().subscribe((user) => {
  //     console.log(user);
  //     this.usuario = user.data.userName;
  //   });
  // }

  // get paginatedData(): ListaRecurso[] {
  //   const start = (this.currentPage - 1) * this.itemsPerPage;
  //   const end = start + this.itemsPerPage;

  //   const filteredData = this.data.filter(
  //     (item) =>
  //       (this.filterByUser
  //         ? item.usuarioCreacion === this.filterByUser
  //         : true) &&
  //       (this.filterByRevisor
  //         ? item.docenteRevisor === this.filterByRevisor
  //         : true) &&
  //       (this.filterByStatus
  //         ? item.estadoRecurso === this.filterByStatus
  //         : item.estadoRecurso !== 'Eliminado')
  //   );
  //   return filteredData.slice(start, end);
  // }

  // eliminarRecurso(idRecurso: number) {
  //   const dialogRef = this.openDialog(
  //     '¿Estás seguro de eliminar este recurso?'
  //   );
  //   dialogRef.afterClosed().subscribe((res) => {
  //     if (res) {
  //       console.log('Eliminando recurso', res);
  //       this.recursoService.eliminarRecurso(idRecurso).subscribe(() => {
  //         console.log('Recurso eliminado');
  //         this.listaRecursos();
  //       });
  //     }
  //   });
  // }

  // prevPage() {
  //   if (this.currentPage > 1) {
  //     this.currentPage--;
  //   }
  // }
      
  // nextPage() {
  //   if (this.currentPage < this.totalPages) {
  //     this.currentPage++;
  //   }
  // }
  
  // getStyleColor(tipoRecurso: string) {
  //   switch (tipoRecurso) {
  //     case 'Archivo':
  //       return 'bg-cyan-700';
  //     case 'Link':
  //       return 'bg-orange-600';
  //     case 'Imagen':
  //       return 'bg-pink-700';
  //     default:
  //       return '';
  //   }
  // }
            
  // getIcon(tipoRecurso: string) {
  //   switch (tipoRecurso) {
  //     case 'Archivo':
  //       return 'insert_drive_file';
  //     case 'Link':
  //       return 'insert_drive_file';
  //     case 'Imagen':
  //       return 'image';
  //     default:
  //       return '';
  //   }
  // }
          
  // openFileInTab(item: any): string {
  //     let urlRecurso: string = '';
                          
  //   if (item.tipoRecurso === 'Link') {
  //     urlRecurso = item.enlaceRecurso;
  //     } else if (
  //     item.tipoRecurso === 'Archivo' ||
  //     item.tipoRecurso === 'Imagen'
  //   ) {
  //     urlRecurso = item.recurso;
  //   }
  //   return urlRecurso;
  // }
    
  //   canEdit(item: any): boolean {
  //     const isCreator = item.usuarioCreacion == this.usuario && this.selectedTab === 'Mis Recursos' && item.estadoRecurso != 'Aprobado';
  //     const isReviewer = item.docenteRevisor == this.usuario && this.selectedTab === 'Por Aprobar' && item.estadoRecurso != 'Aprobado';
  //    const isAdmin = item.docenteRevisor === '' && item.estadoRecurso != 'Aprobado'&& this.selectedTab2 === 'Recursos Académicos';
  //     return isCreator || isReviewer || isAdmin;
  //   }

  //   editarRecurso(idRecurso: number, item:any) {
  //     if(this.canEdit(item)){
  //       if (item.usuarioCreacion == this.usuario) {
  //         this.tituloRecurso = 'Editar Recurso';
  //       } else if (item.docenteRevisor == this.usuario) {
  //         this.tituloRecurso = 'Aprobar Recurso';
  //       } else {
  //         this.tituloRecurso = 'Asignar Revisor';
  //       }
  //     }
  //     this.dialog.open(EditResourceComponent, {
  //       width: '40%',
  //       data: {id: idRecurso, titulo: this.tituloRecurso},
  //     });
  //   }

  @Input() filterByUser: string = '';
  @Input() filterByStatus!: EstadoRecursosType;
  @Input() filterByRevisor: string = '';
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
  public iconActionTable: string = '';
  mensaje: string = '';
  tituloRecurso: string = '';
  usuario: string = '';
  resourceTable!: FormGroup;


  constructor(
    private recursoService: RecursoService,
    private academic: ResourcesComponent,
    @Inject(AsignarRevisorComponent) private approve: AsignarRevisorComponent,
    @Inject(HomeService) private homeService: HomeService,
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.builderForm();
    this.getDataMenu();
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
    this.listaRecursos();
    switch (this.typeTable) {
      case 'Por Aprobar':
        this.tituloRecurso = 'Aprobar Recurso';
        this.iconActionTable = 'assignment_turned_in';
        break;

      case 'Asignar Revisor':
        this.tituloRecurso = 'Asignar Revisor';
        this.iconActionTable = 'perm_contact_calendar';
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
      console.log({ searchData: this.searchData });
      this.descripcion = this.searchData?.nombreRecurso;
      this.listaRecursos();
    }
    if (changes['loadTable']) {
      if (this.loadTable) {
        this.listaRecursos();
      }
    }
  }

  pagination = {
    buttonLeft: true,
    buttonRight: true,
  };

  builderForm() {
    this.resourceTable = this.formBuilder.group({
      limit: [5],
      page: [1],
    });
    this.limit = this.resourceTable.get('limit')?.value;
    this.page = this.resourceTable.get('page')?.value;
  }

  changePage(newPage: number) {
    console.log({
      newPage,
      pagina: this.page,
    });
    if (newPage !== this.page) {
      console.log('PASO');
      this.page = newPage;
      this.listaRecursos();
    }
  }
  public userRol!: string;
  getDataMenu() {
    this.homeService.obtenerDatosMenu().subscribe((user) => {
      console.log({ userDATA: user });
      this.usuario = user.data.userName;
      this.userRol = user.data.rol;
    });
  }
  private idEstado!: number;
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
    if (this.typeTable === 'Por Aprobar') {
      paginate.idEstado = RecursosIdEstados.INGRESADO;
    }

    if (this.filterByStatus) {
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
      const find = StatesByResources.find(
        (state) => state.label === this.filterByStatus
      );
      if (find) paginate.idEstado = find.value;
    }
    if (this.filterByRevisor) {
    }
    console.log({ paginate });
    this.recursoService.getRecursos(paginate).subscribe({
      next: (res: any) => {
        console.log({ res });
        this.data = res.data ?? [];
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
    console.log({
      elementos,
      page: this.page,
      arreglo: arreglo.length,
      more,
    });
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
    }
  }

  nextPage() {
    if (this.pagination.buttonRight) {
      const rightButton = this.resourceTable.get('page')?.value;
      this.resourceTable.get('page')?.setValue(rightButton + 1);
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
  canEdit(item: any): boolean {
    const isCreator =
      item.usuarioCreacion == this.usuario &&
      this.selectedTab === 'Mis Recursos' &&
      item.estadoRecurso !== 'Aprobado' &&
      item.nombreRevisor == '';

    const isAdmin =
      item.docenteRevisor === '' &&
      item.estadoRecurso != 'Aprobado' &&
      this.selectedTab2 === 'Recursos Académicos';
    return isCreator || isAdmin;
  }

  editarRecurso(idRecurso: number, item: any) {
    // if (this.canEdit(item)) {
    //   if (item.usuarioCreacion == this.usuario) {
    //     this.tituloRecurso = 'Editar Recurso';
    //   } else if (item.docenteRevisor == this.usuario) {
    //     this.tituloRecurso = 'Aprobar Recurso';
    //   } else {
    //     this.tituloRecurso = 'Asignar Revisor';
    //   }
    // }
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
  }
      