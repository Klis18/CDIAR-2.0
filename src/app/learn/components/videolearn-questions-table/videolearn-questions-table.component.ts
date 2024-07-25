import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VideolearnService } from '../../services/videolearn.service';
import { MatDialog } from '@angular/material/dialog';
import { HomeService } from '../../../home/services/home.service';
import { GetQuestionsQuery } from '../../interfaces/videolearn.interface';
import { CardConfirmComponent } from '../../../shared/pages/card-confirm/card-confirm.component';
import { EditQuestionVideolearnComponent } from '../edit-question-videolearn/edit-question-videolearn.component';

@Component({
  selector: 'videolearn-questions-table',
  templateUrl: './videolearn-questions-table.component.html',
  styles: ``
})
export class VideolearnQuestionsTableComponent implements OnInit, OnChanges{
  
  @Input() idVideoLearn!: number;
  @Input() loadTable: boolean = false;
  @Output() loadedTableEmitter = new EventEmitter<boolean>();
  @Input() searchData: any;

  data: any[] = [];
  mensaje: string = '';
  pregunta: string = '';
  usuarioCreador: string = '';
  nombreUsuario: string = '';
  docenteRevisor: string = '';
  estado: string = '';
  itemsPerPage: number = 5;
  totalPages: number = 1;
  videoLearnForm!: FormGroup;
 
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
 

  constructor(private videolearnService:VideolearnService,
              private dialog: MatDialog,
              private homeService: HomeService,
              @Inject(FormBuilder) private formBuilder: FormBuilder,

  ) {}

  ngOnInit(){
    this.builderForm();
    this.videoLearnForm.valueChanges.subscribe({
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

    
    this.videolearnService.getVideoLearn(this.idVideoLearn).subscribe((res) => {
      this.usuarioCreador = res.data.usuarioCreador;
      this.docenteRevisor = res.data.nombreRevisor;
      this.estado = res.data.estado;
    });
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
    this.videoLearnForm = this.formBuilder.group({
      limit: [5],
      page: [1],
    });
    this.limit = this.videoLearnForm.get('limit')?.value;
    this.page = this.videoLearnForm.get('page')?.value;
  }

  changePage(newPage: number) {
    if (newPage !== this.page) {
      console.log('PASO');
      this.page = newPage;
      this.listaPreguntas();
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
      const leftButton = this.videoLearnForm.get('page')?.value;
      this.videoLearnForm.get('page')?.setValue(leftButton - 1);
    }
  }

  nextPage() {
    if (this.pagination.buttonRight) {
      const rightButton = this.videoLearnForm.get('page')?.value;
      this.videoLearnForm.get('page')?.setValue(rightButton + 1);
    }
  }


 
  eliminarPregunta(idPregunta: number) {
    const dialogRef = this.openDialog(
      '¿Estás seguro de eliminar esta pregunta del videolearn?'
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
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
