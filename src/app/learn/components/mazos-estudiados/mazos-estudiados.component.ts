import { Component, EventEmitter, Inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HomeService } from '../../../home/services/home.service';
import { typeTable, ListMazo, MazosGetQuery } from '../../interfaces/mazo.interface';
import { FlashcardsComponent } from '../../pages/flashcards/flashcards.component';
import { LearnService } from '../../services/learn.service';
import { DetailsMazoComponent } from '../details-mazo/details-mazo.component';

@Component({
  selector: 'mazos-estudiados',
  templateUrl: './mazos-estudiados.component.html',
  styles: ``
})
export class MazosEstudiadosComponent {
  @Input() typeTable!: typeTable;
  @Input() searchData: any;
  @Input() loadTable: boolean = false;
  @Output() loadedTableEmitter = new EventEmitter<boolean>();
  data: ListMazo[] = [];
  itemsPerPage: number = 5;
  totalPages: number = 1;
  selectedTab = this.mazo.selectedTab;
  nombreMazo: string = '';
  nivel: string = '';
  asignatura: string = '';
  docenteRevisor: string = '';
  nombreRevisor: string = '';
  usuarioCreador: boolean = false;
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

  colors = ['#67E8A2', '#67E8DA', '#C883F1', '#CB48A0', '#7FCDE8', '#E4E87F', '#E8BB7F']; // Puedes cambiar estos colores

  constructor(private learnService:LearnService,
              private dialog: MatDialog,
              private router: Router,
              private mazo: FlashcardsComponent,
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

  changePage(newPage: number) {
    if (newPage !== this.page) {
      console.log('PASO');
      this.page = newPage;
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
  // private idEstado!: number;
  listaMazos() {
    const paginate: MazosGetQuery = {
      page: this.page,
      limit: this.limit,
      idAsignatura: this.idAsignatura,
      idNivel: this.idNivel,
      descripcion: this.nombreMazo,
    };
  
    this.learnService.getMazosEstudiados(paginate).subscribe({
      next: (res: any) => {
        this.data = res.data ?? [];
        if (this.data.length > 0) {
          this.nombreMazo = res.data.nombreMazo;
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

  
  getGradient(index: number) {
    const color1 = this.colors[index % this.colors.length];
    const color2 = this.colors[(index + 1) % this.colors.length];
    return `linear-gradient(to right, ${color1} 0%, ${color2} 100%)`;
  }

  viewDetailsMazo(idMazo: number) {
    
    this.dialog.open(DetailsMazoComponent, {
      width: '30%',
      data: {id: idMazo},
    });
  }

  redirigirPreguntas(item: ListMazo) {
    this.router.navigate(['/learn/preguntas',{id: item.idMazo, mazo: item.nombreMazo}]);
  }

  redirigirEstudiarFlashcards(item: ListMazo) {
    this.router.navigate(['/learn/estudiar-flashcards',{id: item.idMazo, mazo: item.nombreMazo}]);
  }

  
}
