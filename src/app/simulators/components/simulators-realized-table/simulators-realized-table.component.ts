import { Component, EventEmitter, Inject, Input, Output, SimpleChanges } from '@angular/core';
import { ListSimulators, SimulatorSaversGetQuery, typeTable } from '../../interfaces/simulators.interface';
import { DetailsSimulatorComponent } from '../details-simulator/details-simulator.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SimulatorsService } from '../../services/simulators.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AsignarRevisorComponent } from '../../../control/pages/asignar-revisor/asignar-revisor.component';
import { HomeService } from '../../../home/services/home.service';
import { SimulatorsComponent } from '../../pages/simulators/simulators.component';

@Component({
  selector: 'simulators-realized-table',
  templateUrl: './simulators-realized-table.component.html',
  styles: ``
})
export class SimulatorsRealizedTableComponent {
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

  listaSimuladores() {
    const paginate: SimulatorSaversGetQuery = {
      page: this.page,
      limit: this.limit,
      idAsignatura: this.idAsignatura,
      idNivel: this.idNivel,
      nombreSimulador: this.nombreSimulador,
    };
    
    this.simulatorService.getSimulatorsRealized(paginate).subscribe({
      next: (res: any) => {
        this.data = res.data ?? [];
        if (this.data.length > 0) {
          this.nombreSimulador = res.data.nombreSimulador;
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


  getGradient(index: number) {
    const color1 = this.colors[index % this.colors.length];
    const color2 = this.colors[(index + 1) % this.colors.length];
    return `linear-gradient(to right, ${color1} 0%, ${color2} 100%)`;
  }

  viewDetailsSimulator(item: any) {
    this.dialog.open(DetailsSimulatorComponent, {
      width: '32%',
      data: {id: item.idSimuladorRealizado, nivel: item.nivel, asignatura: item.asignatura, nombreSimulador:item.nombreSimulador},
    });
  }

  canStartSimulator(){
    const tab = this.selectedTab !== 'Por Aprobar';
    const isAdmin = this.userRol !== 'Admin';
    return tab && isAdmin;
  }

  //TODO:
  redirigirPreguntas(item: ListSimulators) {
    this.router.navigate(['/simuladores/preguntas',{id: item.idSimulador, simulador: item.nombreSimulador}]);
  }

  // redirigirEstudiarFlashcards(item: ListMazo) {
  //   this.learnService.guardarMazoEstudiado(item.idMazo).subscribe((res) => {
  //     console.log('Mazo guardado', res.data);
  //     this.router.navigate(['/learn/estudiar-flashcards',{id: item.idMazo, mazo: item.nombreMazo}]);
  //   });
  // }

  redirigirIniciarSimulador(item: ListSimulators) {
    this.router.navigate(['/simuladores/iniciar-simulador',{id: item.idSimulador, simulador: item.nombreSimulador}]);
  }


}
