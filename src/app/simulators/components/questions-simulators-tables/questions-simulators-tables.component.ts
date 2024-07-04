import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { QuestionsSimulatorsGetQuery } from '../../interfaces/simulators.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SimulatorsService } from '../../services/simulators.service';
import { MatDialog } from '@angular/material/dialog';
import { CardConfirmComponent } from '../../../shared/pages/card-confirm/card-confirm.component';
import { EditQuestionSimulatorComponent } from '../edit-question-simulator/edit-question-simulator.component';

@Component({
  selector: 'questions-simulators-table',
  templateUrl: './questions-simulators-tables.component.html',
  styles: ``
})
export class QuestionsSimulatorsTablesComponent implements OnInit, OnChanges{
  @Input() idSimulador!: number;
  @Input() loadTable: boolean = false;
  @Output() loadedTableEmitter = new EventEmitter<boolean>();
  @Input() searchData: any;
  data: any[] = [];
  mensaje: string = '';
  pregunta: string = '';
  usuarioCreador: string = '';

  itemsPerPage: number = 5;
  totalPages: number = 1;
  simulatorForm!: FormGroup;
 
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
 

  constructor(private simulatorService:SimulatorsService,
              private dialog: MatDialog,
              @Inject(FormBuilder) private formBuilder: FormBuilder,

  ) {}

  ngOnInit(){
    this.builderForm();
    this.simulatorForm.valueChanges.subscribe({
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
    console.log('Preguntas', this.data);
    console.log('ID', this.idSimulador);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchData']) {
      this.pregunta = this.searchData?.question;
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
    this.simulatorForm = this.formBuilder.group({
      limit: [5],
      page: [1],
    });
    this.limit = this.simulatorForm.get('limit')?.value;
    this.page = this.simulatorForm.get('page')?.value;
  }

  changePage(newPage: number) {
    if (newPage !== this.page) {
      console.log('PASO');
      this.page = newPage;
      this.listaPreguntas();
    }
  }
 

  listaPreguntas() {
    const paginate: QuestionsSimulatorsGetQuery = {
      idSimulador: this.idSimulador,
      page: this.page,
      limit: this.limit,
      pregunta: this.pregunta,
    };
   
    this.simulatorService.getPreguntasSimulador(paginate).subscribe({
      next: (res: any) => {
        console.log('Preguntas Data', res.data);
        this.data = res.data ?? [];
        if (this.data.length > 0) {
          // this.idSimulador = res.data.idPregunta;
          this.pregunta = res.data.pregunta;
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
      const leftButton = this.simulatorForm.get('page')?.value;
      this.simulatorForm.get('page')?.setValue(leftButton - 1);
    }
  }

  nextPage() {
    if (this.pagination.buttonRight) {
      const rightButton = this.simulatorForm.get('page')?.value;
      this.simulatorForm.get('page')?.setValue(rightButton + 1);
    }
  }


 
  eliminarPregunta(idPregunta: number) {
    const dialogRef = this.openDialog(
      '¿Estás seguro de eliminar esta pregunta del simulador?'
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        console.log('Pregunta a eliminar', idPregunta);
        console.log('Eliminando pregunta', res);
        this.simulatorService.deleteSimulatorQuestion(idPregunta).subscribe(() => {
          console.log('Flashcard eliminada');
          this.listaPreguntas();
        });
      }
    });
  }

  editarPreguntaSimulador(idPregunta: number) {
    this.dialog.open(EditQuestionSimulatorComponent, {
      width: '40%',
      data: {idPregunta: idPregunta, idSimulador:this.idSimulador},
    });
  }

  // viewFlashcard(idFlashcard: number) {
  //   this.dialog.open(EditFlashcardComponent, {
  //     width: '40%',
  //     data: {id: idFlashcard, isDisabled: false, titulo: 'Detalles Flashcard'},
  //   });
  // }
}
