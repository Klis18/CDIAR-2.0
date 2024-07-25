import { Component, EventEmitter, Inject, Input, Output, SimpleChanges } from '@angular/core';
import { CardConfirmComponent } from '../../../shared/pages/card-confirm/card-confirm.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CargaHorariaDocenteService } from '../../services/carga-horaria-docente.service';
import { MatDialog } from '@angular/material/dialog';
import { HomeService } from '../../../home/services/home.service';
import { cargaHorariaDocenteDia, ListaCargaHorariaDocenteGetQuery} from '../../interfaces/carga-horaria.interface';
import { EditCargaHorariaComponent } from '../edit-carga-horaria/edit-carga-horaria.component';

@Component({
  selector: 'list-carga-horaria',
  templateUrl: './list-carga-horaria.component.html',
  styles: ``
})

export class ListCargaHorariaComponent {
  @Input() idMazo: number = 0;
  @Input() loadTable: boolean = false;
  @Output() loadedTableEmitter = new EventEmitter<boolean>();
  @Input() searchData: any;
  data: cargaHorariaDocenteDia[] = [];
  mensaje: string = '';
  idFlashcard: number = 0; 
  preguntaFlashcard: string = '';
  usuarioCreador: string = '';
  nombreUsuario: string = '';
  docenteRevisor: string = '';
  estado: string = '';
  itemsPerPage: number = 5;
  totalPages: number = 1;
  cargaHorariaForm!: FormGroup;
  diaSemana: number = 0;
  actividad: string = '';
 
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
  
  public page!: number;
  public limit: number = 5;
  public paginateCurrent: number[] = [];
 

  constructor(private cargaHorariaService:CargaHorariaDocenteService,
              private dialog: MatDialog,
              private homeService: HomeService,
              @Inject(FormBuilder) private formBuilder: FormBuilder,
              

  ) {}

  ngOnInit(): void {
    this.builderForm();
    this.cargaHorariaForm.valueChanges.subscribe({
      next: (res) => {
        if (res?.limit) {
          this.limit = Number(res?.limit);
        }
        if (res?.page) {
          this.page = Number(res?.page);
        }
        this.listaCargaHoraria();
      },
    });
    this.listaCargaHoraria();

    this.homeService.obtenerDatosMenu().subscribe((user:any) => {
      this.nombreUsuario = user.data.userName;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchData']) {
      this.diaSemana = this.searchData?.diasSemana;
      this.actividad = this.searchData?.actividad;
      this.listaCargaHoraria();
    }
    if (changes['loadTable']) {
      if (this.loadTable) {
        this.listaCargaHoraria();
      }
    }
  }
  pagination = {
    buttonLeft: true,
    buttonRight: true,
  };

  builderForm() {
    this.cargaHorariaForm = this.formBuilder.group({
      limit: [5],
      page: [1],
    });
    this.limit = this.cargaHorariaForm.get('limit')?.value;
    this.page = this.cargaHorariaForm.get('page')?.value;
  }

  goToPage(event: Event) {
    const target = event.target as HTMLInputElement;
    let page = parseInt(target.value, 10);
    if (!isNaN(page) && page >= 1 && page <= this.paginateCurrent.length) {
      this.page = page;
      this.listaCargaHoraria();
    } else {
      target.value = this.page.toString();
      this.listaCargaHoraria();
    }
  }
  
  listaCargaHoraria() {
    let paginate: ListaCargaHorariaDocenteGetQuery = {
      pages: this.page,
      limit: this.limit,
      diaSemana: this.diaSemana,
      actividad: this.actividad
    };
    
    this.cargaHorariaService.listarCargaHorariaDocente(paginate).subscribe({
      next: (res: any) => {
        this.data = res.data ?? [];
        if (this.data.length > 0) {
          this.diaSemana = res.data.diaSemana;
          this.actividad = res.data.actividad;
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


  prevPage() {
    if (this.pagination.buttonLeft) {
      const leftButton = this.cargaHorariaForm.get('page')?.value;
      this.cargaHorariaForm.get('page')?.setValue(leftButton - 1);
    }
  }

  nextPage() {
    if (this.pagination.buttonRight) {
      const rightButton = this.cargaHorariaForm.get('page')?.value;
      this.cargaHorariaForm.get('page')?.setValue(rightButton + 1);
    }
  }

 
  eliminarCargaHoraria(idCargaHoraria: number) {
    const dialogRef = this.openDialog(
      '¿Estás seguro de eliminar esta carga horaria?'
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.cargaHorariaService.deleteCargaHoraria(idCargaHoraria).subscribe(() => {
          this.listaCargaHoraria();
        });
      }
    });
  }

  editarCargaHoraria(item:any) {
    const dialogRef = this.dialog.open(EditCargaHorariaComponent, {
      width: '40%',
      data: {id: item.idCargaHoraria, idDocente: item.idDocente, isDisabled: true, titulo: 'Editar Carga Horaria'},
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.listaCargaHoraria();
    });
  }
}
