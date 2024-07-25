import { Component, EventEmitter, Inject, Input, Output, SimpleChanges } from '@angular/core';
import { listadoMetas, listadoMetasGetQuerys } from '../../interfaces/metas.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MetasYRendimientoService } from '../../services/metas-y-rendimiento.service';
import { MatDialog } from '@angular/material/dialog';
import { CardConfirmComponent } from '../../../shared/pages/card-confirm/card-confirm.component';
import { EditMetaComponent } from '../edit-meta/edit-meta.component';

@Component({
  selector: 'meta-table',
  templateUrl: './meta-table.component.html',
  styles: `
  `
})
export class MetaTableComponent {
  @Input() loadTable: boolean = false;
  @Output() loadedTableEmitter = new EventEmitter<boolean>();
  @Input() searchData: any;
  data: any[] = [];
  dataMeta!: listadoMetas[];
  selectedTab:string='';
  mensaje: string = '';
  itemsPerPage: number = 5;
  totalPages: number = 1;
  nivel: string = '';
  asignatura: string = '';
  metasForm!: FormGroup;
  idNivel: number = 0;
  idAsignatura: number = 0;
  cantRegistros: number = 0;
  primerParcial: number = 0;
  segundoParcial: number = 0;
  puntajeObj: number = 0;
  notaSegundoParcial: number = 0;
  porcentajeAvance: number = 0;
  nota:string = '';
 
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
 

  constructor(private metasService:MetasYRendimientoService,
              private dialog: MatDialog,
              @Inject(FormBuilder) private formBuilder: FormBuilder,

  ) {}

  ngOnInit(){
    this.builderForm();
    this.metasForm.valueChanges.subscribe({
      next: (res) => {
        if (res?.limit) {
          this.limit = Number(res?.limit);
        }
        if (res?.page) {
          this.page = Number(res?.page);
        }
        this.listaMetas();
      },
    });
    this.listaMetas();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchData']) {
      this.idNivel = this.searchData?.nivelesType;
      this.idAsignatura = this.searchData?.asignaturas;
      this.listaMetas();
    }
    if (changes['loadTable']) {
      if (this.loadTable) {
        this.listaMetas();
      }
    }
  }
  pagination = {
    buttonLeft: true,
    buttonRight: true,
  };

  builderForm() {
    this.metasForm= this.formBuilder.group({
      limit: [5],
      page: [1],
    });
    this.limit = this.metasForm.get('limit')?.value;
    this.page = this.metasForm.get('page')?.value;
  }

  changePage(newPage: number) {
    if (newPage !== this.page) {
      this.page = newPage;
      this.listaMetas();
    }
  }

  goToPage(event: Event) {
    const target = event.target as HTMLInputElement;
    let page = parseInt(target.value, 10);
    if (!isNaN(page) && page >= 1 && page <= this.paginateCurrent.length) {
      this.page = page;
      this.listaMetas();
    } else {
      target.value = this.page.toString();
      this.listaMetas();
    }
  }
 

  listaMetas() {
    const paginate: listadoMetasGetQuerys = {
        pages: this.page,
        limit: this.limit,
        idNivel: this.idNivel,
        idAsignatura: this.idAsignatura,
      };
      this.metasService.listMetas(paginate).subscribe({
        next: (res: any) => {
          this.dataMeta = res.data ?? [];
          this.cantRegistros = res.data?.length;
          if (this.dataMeta.length > 0) {
            this.idNivel = res.data?.idNivel;
            this.idAsignatura = res.data?.idAsignatura;
            this.primerParcial = res.data?.calificacionPrimerParcial;
            this.segundoParcial = res.data?.calificacionSegundoParcial;
            this.puntajeObj = res.data?.puntajeObjetivo;
            this.paginateCurrent = this.crearArreglo(this.limit, res.numRecord);
          }
          if (this.dataMeta?.length === 0 || !this.dataMeta) {
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
      width: '80%',
      maxWidth: '500px',
      maxHeight: '80%',
      data: {
        mensaje: message,
      },
    });
  }


  prevPage() {
    if (this.pagination.buttonLeft) {
      const leftButton = this.metasForm.get('page')?.value;
      this.metasForm.get('page')?.setValue(leftButton - 1);
    }
  }

  nextPage() {
    if (this.pagination.buttonRight) {
      const rightButton = this.metasForm.get('page')?.value;
      this.metasForm.get('page')?.setValue(rightButton + 1);
    }
  }

  eliminarMeta(idNivel: number) {
    const dialogRef = this.openDialog(
          '¿Estás seguro de eliminar esta meta?',
     );
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.metasService.deleteMeta(idNivel).subscribe(() => {
          this.listaMetas();
        });
      }
    });
  }


  editarMeta(item:listadoMetas) {
    const dialogRef = this.dialog.open(EditMetaComponent, {
      width: '80%',
      maxWidth: '500px',
      maxHeight: '80%',

      data: {id: item.idMeta, isDisabled: true},
    });
    dialogRef.afterClosed().subscribe((res) => {
        this.listaMetas();
    });
  }

  calculaNota(item: listadoMetas){

    let porcentaje = (((item.calificacionPrimerParcial + item.calificacionSegundoParcial)/2)/item.puntajeObjetivo)*100;
    this.porcentajeAvance = Math.round(porcentaje);

    if(item.calificacionSegundoParcial === null){
      this.notaSegundoParcial = ((item.puntajeObjetivo*2)-item.calificacionPrimerParcial);
      if(this.notaSegundoParcial > 10){
        this.nota = 'Lo sentimos, no es posible';
      }
      else{
        this.nota = 'Necesitas obtener '+this.notaSegundoParcial.toString();
      }
    }
    else{
      this.nota = item.calificacionSegundoParcial.toString();
    }
  }

}
