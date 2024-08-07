import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { QuestionsSimulatorsGetQuery } from '../../interfaces/simulators.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SimulatorsService } from '../../services/simulators.service';
import { MatDialog } from '@angular/material/dialog';
import { CardConfirmComponent } from '../../../shared/pages/card-confirm/card-confirm.component';
import { EditQuestionSimulatorComponent } from '../edit-question-simulator/edit-question-simulator.component';
import { HomeService } from '../../../home/services/home.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { CardMessageComponent } from '../../../shared/pages/card-message/card-message.component';

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
nombreUsuario: string = '';
docenteRevisor: string = '';
estado: string = '';
  itemsPerPage: number = 5;
  totalPages: number = 1;
  simulatorForm!: FormGroup;
 
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
 

  constructor(private simulatorService:SimulatorsService,
              private dialog: MatDialog,
              private homeService: HomeService,
              private spinnerService: SpinnerService,
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

    this.homeService.obtenerDatosMenu().subscribe((user:any) => {
      this.nombreUsuario = user.data?.userName;
    });

    
    this.simulatorService.getDatosSimulator(this.idSimulador).subscribe((res) => {
      this.usuarioCreador = res.data?.usuarioCreador;
      this.docenteRevisor = res.data?.nombreRevisor;
      this.estado = res.data?.estado;
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
    this.simulatorForm = this.formBuilder.group({
      limit: [5],
      page: [1],
    });
    this.limit = this.simulatorForm.get('limit')?.value;
    this.page = this.simulatorForm.get('page')?.value;
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
    const paginate: QuestionsSimulatorsGetQuery = {
      idSimulador: this.idSimulador,
      page: this.page,
      limit: this.limit,
      pregunta: this.pregunta,
    };
   
    this.simulatorService.getPreguntasSimulador(paginate).subscribe({
      next: (res: any) => {
        this.data = res.data ?? [];
        if (this.data.length > 0) {
          this.pregunta = res.data?.pregunta;
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
        this.spinnerService.showSpinner();

        this.simulatorService.deleteSimulatorQuestion(idPregunta).subscribe(() => {
          this.spinnerService.hideSpinner();
          this.listaPreguntas();
        },
        (error) => {
            this.spinnerService.hideSpinner();
            this.dialog.open(CardMessageComponent, {
              width: '80%',
              maxWidth: '500px',
              maxHeight: '80%',
              data: {status:'error', mensaje: 'Error al eliminar la pregunta, por favor intente de nuevo.'},
            });
          });  
      }
    });
  }

  editarPreguntaSimulador(idPregunta: number) {
    const dialogRef = this.dialog.open(EditQuestionSimulatorComponent, {
      width: '80%',
      maxWidth: '500px',
      maxHeight: '80%',
      data: {idPregunta: idPregunta, idSimulador:this.idSimulador, isDisabled: true, titulo: 'Editar Pregunta Simulador'},
    });
    dialogRef.afterClosed().subscribe((res) => {
        this.listaPreguntas();
    });
  }

  viewPreguntaSimulador(idPregunta: number) {
    this.dialog.open(EditQuestionSimulatorComponent, {
      width: '80%',
      maxWidth: '500px',
      maxHeight: '80%',
      data: {idPregunta: idPregunta, idSimulador:this.idSimulador, isDisabled: false, titulo: 'Detalles Pregunta Simulador'},
    });
  }
}
