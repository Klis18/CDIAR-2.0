import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { LearnService } from '../../services/learn.service';
import { MatDialog } from '@angular/material/dialog';
import { CardConfirmComponent } from '../../../shared/pages/card-confirm/card-confirm.component';
import { EditFlashcardComponent } from '../edit-flashcard/edit-flashcard.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FlashcardsGetQuery } from '../../interfaces/mazo.interface';
import { HomeService } from '../../../home/services/home.service';

@Component({
  selector: 'questions-table',
  templateUrl: './questions-table.component.html',
  styles: `
  
  `
})
export class QuestionsTableComponent implements OnInit, OnChanges{
  
  @Input() idMazo: number = 0;
  @Input() loadTable: boolean = false;
  @Output() loadedTableEmitter = new EventEmitter<boolean>();
  @Input() searchData: any;
  data: any[] = [];
  mensaje: string = '';
  idFlashcard: number = 0; 
  preguntaFlashcard: string = '';
  usuarioCreador: string = '';
  nombreUsuario: string = '';
  docenteRevisor: string = '';
  estado: string = '';
  itemsPerPage: number = 5;
  totalPages: number = 1;
  flashCards!: FormGroup;
 
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
 

  constructor(private learnService:LearnService,
              private dialog: MatDialog,
              private homeService: HomeService,
              @Inject(FormBuilder) private formBuilder: FormBuilder,

  ) {}

  ngOnInit(): void {
    this.builderForm();
    this.flashCards.valueChanges.subscribe({
      next: (res) => {
        if (res?.limit) {
          this.limit = Number(res?.limit);
        }
        if (res?.page) {
          this.page = Number(res?.page);
        }
        this.listaPreguntas();
      },
    });
    this.listaPreguntas();

    this.homeService.obtenerDatosMenu().subscribe((user:any) => {
      this.nombreUsuario = user.data.userName;
    });

    
    this.learnService.getDatosMazo(this.idMazo).subscribe((res) => {
      this.usuarioCreador = res.data.usuarioCreador;
      this.docenteRevisor = res.data.nombreRevisor;
      this.estado = res.data.estado;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchData']) {
      this.preguntaFlashcard = this.searchData?.question;
      this.listaPreguntas();
    }
    if (changes['loadTable']) {
      if (this.loadTable) {
        this.listaPreguntas();
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

  goToPage(event: Event) {
    const target = event.target as HTMLInputElement;
    let page = parseInt(target.value, 10);
    if (!isNaN(page) && page >= 1 && page <= this.paginateCurrent.length) {
      this.page = page;
      this.listaPreguntas();
    } else {
      target.value = this.page.toString();
      this.listaPreguntas();
    }
  }
 
 

  listaPreguntas() {
    const paginate: FlashcardsGetQuery = {
      id: this.idMazo,
      page: this.page,
      limit: this.limit,
      preguntaFlashcard: this.preguntaFlashcard,
    };
   
    this.learnService.getFlashcardsMazo(paginate).subscribe({
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


 
  eliminarFlashcard(idFlashcard: number) {
    const dialogRef = this.openDialog(
      '¿Estás seguro de eliminar esta flashcard?'
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.learnService.deleteFlashcard(idFlashcard).subscribe(() => {
          this.listaPreguntas();
        });
      }
    });
  }

  editarFlashcard(idFlashcard: number) {
    const dialogRef = this.dialog.open(EditFlashcardComponent, {
      width: '80%',
      maxWidth: '500px',
      maxHeight: '80%',

      data: {id: idFlashcard, isDisabled: true, titulo: 'Editar Flashcard'},
    });
    dialogRef.afterClosed().subscribe(() => {
      this.listaPreguntas();
    });
  }

  viewFlashcard(idFlashcard: number) {
    this.dialog.open(EditFlashcardComponent, {
      width: '80%',
      maxWidth: '500px',
      maxHeight: '80%',

      data: {id: idFlashcard, isDisabled: false, titulo: 'Detalles Flashcard'},
    });
  }

  
}
