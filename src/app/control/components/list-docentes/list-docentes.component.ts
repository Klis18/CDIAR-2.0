import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SecurityService } from '../../services/security.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ListadoCargaDocenteComponent } from '../listado-carga-docente/listado-carga-docente.component';
import { ViewCargaHorariaComponent } from '../view-carga-horaria/view-carga-horaria.component';

@Component({
  selector: 'list-docentes',
  templateUrl: './list-docentes.component.html',
  styles: ``
})
export class ListDocentesComponent implements OnInit, OnChanges{
  @Input() loadTable: boolean = false;
  @Output() loadedTableEmitter = new EventEmitter<boolean>();
  @Input() searchData: any;
  @Input() id!:number;
  @Input() opcion!:string;

  dataDocentes: any;
  // id = this.data.id;
  // opcion = this.data.opcion;
  data: any;
  nombre = '';
  searchInfo: any;
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

  constructor(private securityService: SecurityService,
              @Inject(FormBuilder) private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<ListDocentesComponent>,
              private dialog: MatDialog
  ){
    
  }

  verCargaHoraria(idDocente: string){
    const dialogRef = this.dialog.open(ViewCargaHorariaComponent, {
      width: '70%',
      maxHeight: '80%',
      data: {
        idDocente: idDocente
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaDocentes();
      }
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
      this.nombre = this.searchData?.question;
      this.listaDocentes();
    }
    if (changes['loadTable']) {
      if (this.loadTable) {
        this.listaDocentes();
      }
    }
  }
  
  pagination = {
    buttonLeft: true,
    buttonRight: true,
  };

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
 
 

  listaDocentes() {
    // const paginate: RevisorGetQuery = {
    //   page: this.page,
    //   limit: this.limit,
    //   nombre: this.nombre,
    // };
    this.securityService.getListaDocentes().subscribe({
      next: (res: any) => {
        this.data = res.data ?? [];
        if (this.data.length > 0) {
          this.nombre = res.data.nombresCompletos;
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

}
