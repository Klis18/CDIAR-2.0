import { Component, EventEmitter, Inject, Input, Output, SimpleChanges } from '@angular/core';
import { CardConfirmComponent } from '../../../shared/pages/card-confirm/card-confirm.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CargaHorariaDocenteService } from '../../services/carga-horaria-docente.service';
import { MatDialog } from '@angular/material/dialog';
import { HomeService } from '../../../home/services/home.service';
import { cargaHoraria, cargaHorariaDocenteDia, listaCargaHoraria } from '../../interfaces/carga-horaria.interface';

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

    
    // this.learnService.getDatosMazo(this.idMazo).subscribe((res) => {
    //   this.usuarioCreador = res.data.usuarioCreador;
    //   this.docenteRevisor = res.data.nombreRevisor;
    //   this.estado = res.data.estado;
    // });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchData']) {
      // this.cargaDia = this.searchData?.question;
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
    // this.cargaHorariaService.listarCargaHorariaDocente().subscribe((res)=>{
    //   this.data = res.data ?? [];
    // });

    this.cargaHorariaService.listarCargaHorariaDocente().subscribe({
      next: (res: any) => {
        this.data = res.data ?? [];
        if (this.data.length > 0) {
          this.idFlashcard = res.data.idFlashcard;
          this.preguntaFlashcard = res.data.pregunta;
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

  // listaPreguntas() {
  //   const paginate: FlashcardsGetQuery = {
  //     id: this.idMazo,
  //     page: this.page,
  //     limit: this.limit,
  //     preguntaFlashcard: this.preguntaFlashcard,
  //   };
   
  //   this.learnService.getFlashcardsMazo(paginate).subscribe({
  //     next: (res: any) => {
  //       this.data = res.data ?? [];
  //       if (this.data.length > 0) {
  //         this.idFlashcard = res.data.idFlashcard;
  //         this.preguntaFlashcard = res.data.pregunta;
  //         this.paginateCurrent = this.crearArreglo(this.limit, res.numRecord);
  //       }
  //       if (this.data?.length === 0 || !this.data) {
  //         this.paginateCurrent = [1];
  //       }
  //     },
  //     complete: () => {
  //       this.loadedTableEmitter.emit(false);
  //     },
  //   });
  // }

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
        // this.learnService.deleteFlashcard(idFlashcard).subscribe(() => {
        //   console.log('Flashcard eliminada');
        //   this.listaPreguntas();
        // });
      }
    });
  }

  editarCargaHoraria(idCargaHoraria: number) {
    // const dialogRef = this.dialog.open(EditFlashcardComponent, {
    //   width: '40%',
    //   data: {id: idFlashcard, isDisabled: true, titulo: 'Editar Flashcard'},
    // });

    // dialogRef.afterClosed().subscribe((res) => {
    //   this.listaPreguntas();
    // });
  }

  viewFlashcard(idFlashcard: number) {
    // this.dialog.open(EditFlashcardComponent, {
    //   width: '40%',
    //   data: {id: idFlashcard, isDisabled: false, titulo: 'Detalles Flashcard'},
    // });
  }
}
