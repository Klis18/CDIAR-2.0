import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { ListaDocentesPorAprobar } from '../../interfaces/lista-docentes.interface';
import { DocenteAprobacion, DocentesAprobarGetQuery } from '../../interfaces/docente-aprobacion.interface';
import { SecurityService } from '../../services/security.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'listado-aprobacion-docente',
  templateUrl: './listado-aprobacion-docente.component.html',
  styles: ``
})
export class ListadoAprobacionDocenteComponent implements OnInit, OnChanges {
  @Input() loadTable: boolean = false;
  @Output() loadedTableEmitter = new EventEmitter<boolean>();
  @Input() searchData: any;
  
  data: ListaDocentesPorAprobar[] = [];
  docenteAprobado: boolean = false;
  nombresCompletos: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  cedula: string = '';
  correo: string = '';
  telefono: string = '';
  cantidadRegistros: number = 0;
  fechaSolicitud: Date = new Date();
  private securityService = inject(SecurityService);
  searchInfo: any;
  nombreDocente: string = '';
  docentes!: FormGroup;

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
  pagination = {
    buttonLeft: true,
    buttonRight: true,
  };

constructor(@Inject(FormBuilder) private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.builderForm();
    this.docentes.valueChanges.subscribe({
      next: (res) => {
        if (res?.limit) {
          this.limit = Number(res?.limit);
        }
        if (res?.page) {
          this.page = Number(res?.page);
        }
        this.listaDocentes();
      },
    });
    this.listaDocentes();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchData']) {
      this.nombreDocente = this.searchData?.question;
      this.listaDocentes();
    }
    if (changes['loadTable']) {
      if (this.loadTable) {
        this.listaDocentes();
      }
    }
  }


  listaDocentes() {
    const querys: DocentesAprobarGetQuery = {
      nombreDocente: this.nombreDocente,
      pages: this.page,
      limit: this.limit,
    };
  
    this.securityService.listaDocPorAprobar(querys).subscribe({
      next: (res: any) => {
        this.data = res.data ?? [];
        this.cantidadRegistros = res.data?.length;
        if (this.data.length > 0) {
          this.nombreDocente = res.data.nombresCompletos;
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

  builderForm() {
    this.docentes = this.formBuilder.group({
      limit: [5],
      page: [1],
    });
    this.limit = this.docentes.get('limit')?.value;
    this.page = this.docentes.get('page')?.value;
  }

  goToPage(event: Event) {
    const target = event.target as HTMLInputElement;
    let page = parseInt(target.value, 10);
    if (!isNaN(page) && page >= 1 && page <= this.paginateCurrent.length) {
      this.page = page;
      this.listaDocentes();
    } else {
      target.value = this.page.toString();
      this.listaDocentes();
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
      const leftButton = this.docentes.get('page')?.value;
      this.docentes.get('page')?.setValue(leftButton - 1);
    }
  }

  nextPage() {
    if (this.pagination.buttonRight) {
      const rightButton = this.docentes.get('page')?.value;
      this.docentes.get('page')?.setValue(rightButton + 1);
    }
  }

  get paginatedData(): ListaDocentesPorAprobar[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.data.slice(start, end);
  }

  getCurrentDocente(docente: DocenteAprobacion) {
    docente.correo = this.correo;
    return docente;
  }

  aprobarDocente(correo: string, aprobado: boolean) {
    const docente = { correo, aprobado };
    this.securityService.aprobarDocente(docente).subscribe((res) => {
    });
  }

  rechazarDocente(correo: string, aprobado: boolean) {
    const docente = { correo, aprobado };
    this.securityService.aprobarDocente(docente).subscribe((res) => {
    });
  }
}
