import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ListSimulators, SimulatorsGetQuery, typeTable } from '../../interfaces/simulators.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SimulatorsService } from '../../services/simulators.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SimulatorsComponent } from '../../pages/simulators/simulators.component';
import { AsignarRevisorComponent } from '../../../control/pages/asignar-revisor/asignar-revisor.component';
import { HomeService } from '../../../home/services/home.service';
import { Estados, IdEstados } from '../../../shared/interfaces/estados.interface';
import { CardConfirmComponent } from '../../../shared/pages/card-confirm/card-confirm.component';
import { ROLES } from '../../../shared/interfaces/roles.interface';
import { DetailsSimulatorComponent } from '../details-simulator/details-simulator.component';
import { EditSimulatorComponent } from '../edit-simulator/edit-simulator.component';
import { SelectRevisorComponent } from '../../../control/components/select-revisor/select-revisor.component';

@Component({
  selector: 'cards-simulators',
  templateUrl: './cards-simulators.component.html',
  styles: ``
})
export class CardsSimulatorsComponent implements OnInit, OnChanges{

  @Input() filterByUser: string = '';
  @Input() filterByStatus: string = '';
  @Input() filterByRevisor: string = '';
  @Input() typeTable!: typeTable;
  @Input() searchData: any;
  @Input() loadTable: boolean = false;
  @Output() loadedTableEmitter = new EventEmitter<boolean>();
  data: ListSimulators[] = [];
  itemsPerPage: number = 5;
  totalPages: number = 1;
  selectedTab = this.simulator.selectedTab;
  selectedTab2 = this.approve.selectedTab;
  nombreSimulador: string = '';
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
  public page!: number;
  public limit: number = 5;
  public paginateCurrent: number[] = [];
  mensaje: string = '';
  tituloMazo: string = '';
  usuario: string = '';
  simulators!: FormGroup;
  creadorSimulador: string = '';

  colors = ['#8B7CC0', '#924294', '#2E90A8', '#73C5D3', '#4581BA', '#5BC9D7', '#6C3EB1']; 


  constructor(private simulatorService:SimulatorsService,
              private dialog: MatDialog,
              private router: Router,
              private simulator: SimulatorsComponent,
              @Inject(AsignarRevisorComponent) private approve: AsignarRevisorComponent,
              @Inject(HomeService) private homeService: HomeService,
              @Inject(FormBuilder) private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.builderForm();
    this.getDataMenu();
    this.simulators.valueChanges.subscribe({
      next: (res) => {
        if (res?.limit) {
          this.limit = Number(res?.limit);
        }
        if (res?.page) {
          this.page = Number(res?.page);
        }
        this.listaSimuladores();
      },
    });
    this.listaSimuladores();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchData']) {
      this.idAsignatura = this.searchData?.asignaturas;
      this.idNivel = this.searchData?.nivelesType;
      this.nombreSimulador = this.searchData?.descripcion;
      this.listaSimuladores();
    }
    if (changes['loadTable']) {
      if (this.loadTable) {
        this.listaSimuladores();
      }
    }
  }
  pagination = {
    buttonLeft: true,
    buttonRight: true,
  };
  builderForm() {
    this.simulators = this.formBuilder.group({
      limit: [5],
      page: [1],
    });
    this.limit = this.simulators.get('limit')?.value;
    this.page = this.simulators.get('page')?.value;
  }

  changePage(newPage: number) {
    if (newPage !== this.page) {
      console.log('PASO');
      this.page = newPage;
      this.listaSimuladores();
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
  listaSimuladores() {
    const paginate: SimulatorsGetQuery = {
      page: this.page,
      limit: this.limit,
      idAsignatura: this.idAsignatura,
      idNivel: this.idNivel,
      nombreSimulador: this.nombreSimulador,
      idEstado: this.idEstado,
      nombreDocenteRevisor: this.nombreRevisor,
      usuarioCreador: this.usuarioCreador,
    };
    if (this.typeTable === 'Mis Simuladores') {
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
    if(this.typeTable === 'Simuladores') {
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
   
    this.simulatorService.getSimulators(paginate).subscribe({
      next: (res: any) => {
        this.data = res.data ?? [];
        if (this.data.length > 0) {
          this.nombreSimulador = res.data.nombreSimulador;
          this.nivel = res.data.nivel;
          this.asignatura = res.data.asignatura;
          this.docenteRevisor = res.data.nombreDocenteRevisor;
          this.creadorSimulador = res.data.usuarioCreador;
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

  eliminarSimulador(idSimulador: number) {
    const dialogRef = this.openDialog(
      '¿Estás seguro de eliminar este simulador?'
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.simulatorService.deleteSimulator(idSimulador).subscribe(() => {
          this.listaSimuladores();
        });
      }
    });
  }

  prevPage() {
    if (this.pagination.buttonLeft) {
      const leftButton = this.simulators.get('page')?.value;
      this.simulators.get('page')?.setValue(leftButton - 1);
    }
  }

  nextPage() {
    if (this.pagination.buttonRight) {
      const rightButton = this.simulators.get('page')?.value;
      this.simulators.get('page')?.setValue(rightButton + 1);
    }
  }

//TODO:
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

  //TODO:
  canEdit(item: any): boolean {
    const isCreator =
      item.usuarioCreacion == this.usuario &&
      this.selectedTab === 'Mis Simuladores' &&
      item.estado !== 'Aprobado' &&
      item.nombreRevisor == '';

    const isAdmin =
      item.docenteRevisor === '' &&
      item.estado != 'Aprobado' &&
      this.selectedTab2 === 'Simuladores';
    return isCreator || isAdmin;
  }

  //TODO:
  editarSimulador(idSimulador: number, item: any) {
    // if (this.canEdit(item)) {
    //   if (item.usuarioCreador == this.usuario) {
    //     this.tituloMazo = 'Editar Mazo';
    //   } else if (item.docenteRevisor == this.usuario) {
    //     this.tituloMazo = 'Aprobar Mazo';
    //   } else {
    //     this.tituloMazo = 'Asignar Revisor';
    //   }
    // }
    const dialogRef = this.dialog.open(EditSimulatorComponent, {
      width: '40%',
      maxHeight: '80%',
      data: {
        id: idSimulador,
        // titulo: this.tituloMazo,
        typeModal: this.typeTable,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaSimuladores();
      }
    });
  }

  getGradient(index: number) {
    const color1 = this.colors[index % this.colors.length];
    const color2 = this.colors[(index + 1) % this.colors.length];
    return `linear-gradient(to right, ${color1} 0%, ${color2} 100%)`;
  }

  viewDetailsSimulator(idSimulator: number, nivel: string, asignatura: string) {
    
    this.dialog.open(DetailsSimulatorComponent, {
      width: '30%',
      data: {id: idSimulator, nivel: nivel, asignatura: asignatura},
    });
  }

  //TODO:
  redirigirPreguntas(item: ListSimulators) {
    this.router.navigate(['/simuladores/preguntas',{id: item.idSimulador, simulador: item.nombreSimulador}]);
  }

  redirigirIniciarSimulador(item: ListSimulators) {
        this.router.navigate(['/simuladores/iniciar-simulador',{id: item.idSimulador, simulador: item.nombreSimulador}]);

  //   this.learnService.guardarMazoEstudiado(item.idMazo).subscribe((res) => {
  //     console.log('Mazo guardado', res.data);
  //     this.router.navigate(['/learn/estudiar-flashcards',{id: item.idMazo, mazo: item.nombreMazo}]);
  //   });
  }

  //TODO:
  asignaRevisor(idSimulador: number) {
    const dialogRef = this.dialog.open(SelectRevisorComponent, {
      width: '80%',
      data: {id: idSimulador, opcion:'Simuladores'},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaSimuladores();
      }
    });
  }

  saveSimulatorToReview(idSimulador: number) {
    this.simulatorService.SaveSimulatorToReview(idSimulador).subscribe(() => {
      console.log('Simulador guardado');
    });
  }
}
