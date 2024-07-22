import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { VideolearnService } from '../../services/videolearn.service';
import { GetQuestionsQuery } from '../../interfaces/videolearn.interface';
import { MatDialog } from '@angular/material/dialog';
import { CardConfirmComponent } from '../../../shared/pages/card-confirm/card-confirm.component';
import { EditQuestionVideolearnComponent } from '../../components/edit-question-videolearn/edit-question-videolearn.component';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styles: ``
})
export class QuestionListComponent implements OnInit{
  @Input() idVideoLearn!: number;
  @Input() questions: any[] = [];
  @Input() loadTable: boolean = false;
  @Output() loadedTableEmitter = new EventEmitter<boolean>();



  data: any[] = [];
  mensaje: string = '';
  minutoVideoL: number = 0;
  pregunta: string = '';
  usuarioCreador: string = '';
  nombreUsuario: string = '';
  docenteRevisor: string = '';
  estado: string = '';
  itemsPerPage: number = 5;
  totalPages: number = 1;
  // videoLearnForm!: FormGroup;
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

  constructor(private questionService: QuestionService, 
              private videolearnService:VideolearnService,
              private dialog: MatDialog,
            ) {}

  ngOnInit() {
    // this.questions = this.questionService.getQuestions();
    this.listaPreguntas();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['loadTable']) {
      if (this.loadTable) {
        this.listaPreguntas();
      }
    }
  }

  listaPreguntas() {
    const paginate: GetQuestionsQuery = {
      idVideoLearn: this.idVideoLearn,
      pregunta: this.pregunta,
    };
   
    this.videolearnService.getQuestionsVideolearn(paginate).subscribe({
      next: (res: any) => {
        console.log('Preguntas Data', res.data);
        this.data = res.data ?? [];
        if (this.data.length > 0) {
          // this.idSimulador = res.data.idPregunta;
          this.pregunta = res.data.pregunta;          
          // this.paginateCurrent = this.crearArreglo(this.limit, res.numRecord);
        }
        if (this.data?.length === 0 || !this.data) {
          // this.paginateCurrent = [1];
        }
      },
      complete: () => {
        this.loadedTableEmitter.emit(false);
      },
    });
  }

  openDialog(message: string) {
    return this.dialog.open(CardConfirmComponent, {
      data: {
        mensaje: message,
      },
      width: '30%',
    });
  }

  eliminarPregunta(idPregunta: number) {
    const dialogRef = this.openDialog(
      '¿Estás seguro de eliminar esta pregunta del videolearn?'
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        console.log('Pregunta a eliminar', idPregunta);
        console.log('Eliminando pregunta', res);
        this.videolearnService.deleteQuestionVideolearn(idPregunta).subscribe(() => {
          console.log('pregunta de videolearn eliminada');
          this.listaPreguntas();
        });
      }
    });
  }

  editarPreguntaVideoLearn(idPregunta: number) {
    const dialogRef = this.dialog.open(EditQuestionVideolearnComponent, {
      width: '40%',
      data: {idPregunta: idPregunta, idVideoLearn:this.idVideoLearn, isDisabled: true, titulo: 'Editar Pregunta VideoLearn'},
    });
    dialogRef.afterClosed().subscribe((res) => {
        this.listaPreguntas();
    });
  }

  viewPreguntaVideoLearn(idPregunta: number) {
    this.dialog.open(EditQuestionVideolearnComponent, {
      width: '40%',
      data: {idPregunta: idPregunta, idVideoLearn:this.idVideoLearn, isDisabled: false, titulo: 'Detalles Pregunta VideoLearn'},
    });
  }

}
