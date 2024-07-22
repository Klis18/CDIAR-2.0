import { Component, EventEmitter, Inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HomeService } from '../../../home/services/home.service';
import { CardConfirmComponent } from '../../../shared/pages/card-confirm/card-confirm.component';
import { mallaAcademica, mallaAcademicaGetQuerys, mallaAcademicaNiveles, mallaAcademicaNivelesGetQuerys } from '../../interfaces/malla-academica.interface';
import { SecurityService } from '../../services/security.service';
import { EditMallaAcademicaComponent } from '../edit-malla-academica/edit-malla-academica.component';

@Component({
  selector: 'list-niveles',
  templateUrl: './list-niveles.component.html',
  styles: ``
})
export class ListNivelesComponent {
   // @Input() idNivel!: number;
  // @Input() idAsignatura!: number;
  @Input() loadTable: boolean = false;
  @Output() loadedTableEmitter = new EventEmitter<boolean>();
  @Input() searchData: any;
  data: any[] = [];
  dataMalla!: mallaAcademicaNiveles[];
  selectedTab:string='';
  mensaje: string = '';
//   pregunta: string = '';
//   usuarioCreador: string = '';
// nombreUsuario: string = '';
// docenteRevisor: string = '';
// estado: string = '';
  itemsPerPage: number = 5;
  totalPages: number = 1;
  nivel: string = '';
  asignatura: string = '';
  mallaAcademicaForm!: FormGroup;
  idNivel: number = 0;
  idAsignatura: number = 0;
  cantRegistros: number = 0;
 
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
  
  public page!: number;
  public limit: number = 5;
  public paginateCurrent: number[] = [];
 

  constructor(private securityService:SecurityService,
              private dialog: MatDialog,
              @Inject(FormBuilder) private formBuilder: FormBuilder,

  ) {}

  ngOnInit(){
    this.builderForm();
    this.mallaAcademicaForm.valueChanges.subscribe({
      next: (res) => {
        if (res?.limit) {
          this.limit = Number(res?.limit);
        }
        if (res?.page) {
          this.page = Number(res?.page);
        }
        this.listaMallaAcademicaNiveles();
      },
    });
    this.listaMallaAcademicaNiveles();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchData']) {
      this.idNivel = this.searchData?.nivelesType;
      this.listaMallaAcademicaNiveles();
    }
    if (changes['loadTable']) {
      if (this.loadTable) {
        this.listaMallaAcademicaNiveles();
      }
    }
  }
  pagination = {
    buttonLeft: true,
    buttonRight: true,
  };

  builderForm() {
    this.mallaAcademicaForm= this.formBuilder.group({
      limit: [5],
      page: [1],
    });
    this.limit = this.mallaAcademicaForm.get('limit')?.value;
    this.page = this.mallaAcademicaForm.get('page')?.value;
  }

  goToPage(event: Event) {
    const target = event.target as HTMLInputElement;
    let page = parseInt(target.value, 10);
    if (!isNaN(page) && page >= 1 && page <= this.paginateCurrent.length) {
      this.page = page;
      this.listaMallaAcademicaNiveles();
    } else {
      target.value = this.page.toString();
      this.listaMallaAcademicaNiveles();
    }
  }
 

  listaMallaAcademicaNiveles() {
    const paginate: mallaAcademicaNivelesGetQuerys = {
        // pages: this.page,
        // limit: this.limit,
        idNivel: this.idNivel,
        // idAsignatura: this.idAsignatura,
      };
      this.securityService.listaMallaAcademicaNiveles(paginate).subscribe({
        next: (res: any) => {
          this.dataMalla = res.data ?? [];
          this.cantRegistros = res.data.length;
          if (this.dataMalla.length > 0) {
            this.idNivel = res.data.idNivel;
            this.paginateCurrent = this.crearArreglo(this.limit, res.numRecord);
          }
          if (this.dataMalla?.length === 0 || !this.dataMalla) {
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
      const leftButton = this.mallaAcademicaForm.get('page')?.value;
      this.mallaAcademicaForm.get('page')?.setValue(leftButton - 1);
    }
  }

  nextPage() {
    if (this.pagination.buttonRight) {
      const rightButton = this.mallaAcademicaForm.get('page')?.value;
      this.mallaAcademicaForm.get('page')?.setValue(rightButton + 1);
    }
  }

  eliminarNivel(idNivel: number) {
    const dialogRef = this.openDialog(
      'Si elimina este nivel, se eliminarán todas las asignaturas pertenecientes al mismo,'+ 
          '¿Estás seguro de eliminar este nivel?'
     );
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.securityService.deleteNivel(idNivel).subscribe(() => {
          this.listaMallaAcademicaNiveles();
        });
      }
    });
  }

  editarNivel(item:mallaAcademicaNiveles) {
    const dialogRef = this.dialog.open(EditMallaAcademicaComponent, {
      width: '40%',
      data: {id:item.idNivel, isDisabled: true, titulo: 'Editar Nivel', tipo:'1'},
    });
    dialogRef.afterClosed().subscribe((res) => {
        this.listaMallaAcademicaNiveles();
    });
  }

}
