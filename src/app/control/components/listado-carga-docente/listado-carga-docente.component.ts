import { Component, EventEmitter, Inject, Input, Output, SimpleChanges } from '@angular/core';
import { SecurityService } from '../../services/security.service';
import { CargaHorariaDocenteService } from '../../../carga-horaria-docente/services/carga-horaria-docente.service';
import { cargaHoraria, ListaCargaHorariaDocenteGetQuery, diasSemana } from '../../../carga-horaria-docente/interfaces/carga-horaria.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'listado-carga-docente',
  templateUrl: './listado-carga-docente.component.html',
  styles: ``
})
export class ListadoCargaDocenteComponent {
  @Input() loadTable: boolean = false;
  @Output() loadedTableEmitter = new EventEmitter<boolean>();
  @Input() searchData: any;
  @Input() id!: string;

  dataDocentes: any;
  nombre = '';
  searchInfo: any;
  cargaDocentes!: FormGroup;
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

  constructor(private cargaHorariaService: CargaHorariaDocenteService,
              @Inject(FormBuilder) private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<ListadoCargaDocenteComponent>,
  ){
  
  }

  listaCargaHorariaPorDocente(){
    let paginate: ListaCargaHorariaDocenteGetQuery = {
      pages: this.page,
      limit: this.limit,
      diaSemana: this.diaSemana,
      actividad: this.actividad
    };
    
    this.cargaHorariaService.listaCargaHorariaTabla(this.id,paginate).subscribe({
      next: (res: any) => {
        this.dataDocentes = res.data ?? [];
        if (this.dataDocentes.length > 0) {
          this.diaSemana = res.data.diaSemana;
          this.actividad = res.data.actividad;
          this.paginateCurrent = this.crearArreglo(this.limit, res.numRecord);
        }
        if (this.dataDocentes?.length === 0 || !this.dataDocentes) {
          this.paginateCurrent = [1];
        }
      },
      complete: () => {
        this.loadedTableEmitter.emit(false);
      },
    });
  }


  cancelar() {
    this.dialogRef.close();
  }

  
  CloseModal(mensaje?: string) {
    this.dialogRef.close(mensaje);
  }


  //probando
  ngOnInit(): void {
    this.builderForm();
    this.cargaDocentes.valueChanges.subscribe({
      next: (res) => {
        if (res?.limit) {
          this.limit = Number(res?.limit);
        }
        if (res?.page) {
          this.page = Number(res?.page);
        }
        this.listaCargaHorariaPorDocente();
      },
    });
    this.listaCargaHorariaPorDocente();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchData']) {
      this.nombre = this.searchData?.question;
      this.listaCargaHorariaPorDocente();
    }
    if (changes['loadTable']) {
      if (this.loadTable) {
        this.listaCargaHorariaPorDocente();
      }
    }
  }
  pagination = {
    buttonLeft: true,
    buttonRight: true,
  };

  builderForm() {
    this.cargaDocentes = this.formBuilder.group({
      limit: [5],
      page: [1],
    });
    this.limit = this.cargaDocentes.get('limit')?.value;
    this.page = this.cargaDocentes.get('page')?.value;
  }

  goToPage(event: Event) {
    const target = event.target as HTMLInputElement;
    let page = parseInt(target.value, 10);
    if (!isNaN(page) && page >= 1 && page <= this.paginateCurrent.length) {
      this.page = page;
      this.listaCargaHorariaPorDocente();
    } else {
      target.value = this.page.toString();
      this.listaCargaHorariaPorDocente();
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


  prevPage() {
    if (this.pagination.buttonLeft) {
      const leftButton = this.cargaDocentes.get('page')?.value;
      this.cargaDocentes.get('page')?.setValue(leftButton - 1);
    }
  }

  nextPage() {
    if (this.pagination.buttonRight) {
      const rightButton = this.cargaDocentes.get('page')?.value;
      this.cargaDocentes.get('page')?.setValue(rightButton + 1);
    }
  }
}
