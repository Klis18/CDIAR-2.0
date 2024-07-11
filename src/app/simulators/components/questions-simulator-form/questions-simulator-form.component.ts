import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ModeFormsResources } from '../../../academic-resources/interfaces/recurso.interface';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SimulatorsService } from '../../services/simulators.service';
import { HomeService } from '../../../home/services/home.service';
import { OptionsQuestion, TipoPreguntas, UpdateSimulatorQuestion } from '../../interfaces/simulators.interface';
import { debounceTime, Subscription } from 'rxjs';

@Component({
  selector: 'questions-simulator-form',
  templateUrl: './questions-simulator-form.component.html',
  styles: ``
})
export class QuestionsSimulatorFormComponent implements OnInit, OnChanges{
  @Input() formData!: UpdateSimulatorQuestion;
  @Input() modeForm!: ModeFormsResources;
  @Input() id!: number;
  @Output() editedDataEmitter = new EventEmitter<any>();
  @Output() valueFormEmitter = new EventEmitter<boolean>();
  @Output() asignaturaEmitter = new EventEmitter<any>();
  @Input() onlyView!: boolean;

  tiposPreguntasType: { label: string; value: string }[] = [];
  asignaturas: { label: string; value: string }[] = [];
  simulatorQuestionGroupForm!: FormGroup;
  rol: string = '';
  nivel: string = '';
  asignatura: string = '';
  nombreSimulador: string = '';

  private subscriptions: Subscription[] = [];


  opcionesRespuestas: OptionsQuestion[] = [];
  selectedOption: string = '';
  radioSeleccionado1:boolean = false;
  radioSeleccionado2:boolean = false;
  radioSeleccionado3:boolean = false;
  radioSeleccionado4:boolean = false;

  checkboxSeleccionado1:boolean = false;
  checkboxSeleccionado2:boolean = false;
  checkboxSeleccionado3:boolean = false;
  checkboxSeleccionado4:boolean = false;

 

  constructor(
    private fb: FormBuilder,
    private simulatorService: SimulatorsService,
    private homeService: HomeService
  ) {}

  ngOnInit() {
    this.createForm();
    this.loadTiposPreguntas();
    this.obtenerDatosSimulador(this.id);
    this.homeService.obtenerDatosMenu().subscribe({
      next: (user) => {
        if (user) this.rol = user.data?.rol;
       // this.ngSuscribesOnInit();

        if (this.formData) {
          console.log('Data desde preguntas simulador', this.formData);
          this.setData(this.formData);
        }
      },
      error: () => {
        window.alert('No cargo la información del Usuario Administrador');
      },
    });

    this.subscriptions.push(
      this.simulatorQuestionGroupForm.valueChanges.pipe(
        debounceTime(300)  // Ejemplo de debounce para reducir peticiones
      ).subscribe(() => {
        this.clickControllers();
      if(this.questionType === 2){
        this.opcionesRespuestas=[
          {respuesta: this.simulatorQuestionGroupForm.get('opcionSimple1')?.value, esCorrecta: this.radioSeleccionado1},
          {respuesta: this.simulatorQuestionGroupForm.get('opcionSimple2')?.value, esCorrecta:  this.radioSeleccionado2},
          {respuesta: this.simulatorQuestionGroupForm.get('opcionSimple3')?.value, esCorrecta:  this.radioSeleccionado3},
          {respuesta: this.simulatorQuestionGroupForm.get('opcionSimple4')?.value, esCorrecta:  this.radioSeleccionado4},
        ]
      }else if(this.questionType === 1){
        this.opcionesRespuestas=[
          {respuesta: this.simulatorQuestionGroupForm.get('opcionMultiple1')?.value, esCorrecta: this.checkboxSeleccionado1},
          {respuesta: this.simulatorQuestionGroupForm.get('opcionMultiple2')?.value, esCorrecta:  this.checkboxSeleccionado2},
          {respuesta: this.simulatorQuestionGroupForm.get('opcionMultiple3')?.value, esCorrecta:  this.checkboxSeleccionado3},
          {respuesta: this.simulatorQuestionGroupForm.get('opcionMultiple4')?.value, esCorrecta:  this.checkboxSeleccionado4},
        ]

      }
      const response = {
        idSimulador: this.id,
        pregunta: this.simulatorQuestionGroupForm.get('pregunta')?.value,
        idTipoPregunta: this.questionType,
        opcionesRespuestas: this.opcionesRespuestas,
      };
      

      console.log(response);
      this.editedDataEmitter.emit(response);
      this.valueFormEmitter.emit(this.simulatorQuestionGroupForm.valid);

      })
    );
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['formData']) {
      this.setData(changes['formData'].currentValue);
      this.clickControllers();
    }
  }

  createForm() {
    this.simulatorQuestionGroupForm = this.fb.group({
      pregunta: ['', Validators.required],
      idTipoPregunta:[0, Validators.required],
      opcionSimple1: [''],
      opcionSimple2: [''],
      opcionSimple3: [''],
      opcionSimple4: [''],
      opcionMultiple1: [''],
      opcionMultiple2: [''],
      opcionMultiple3: [''],
      opcionMultiple4: [''],

      radio1: new FormControl(false),
      radio2: new FormControl(false),
      radio3: new FormControl(false),
      radio4: new FormControl(false),

      checkbox1: new FormControl(false),
      checkbox2: new FormControl(false),
      checkbox3: new FormControl(false),
      checkbox4: new FormControl(false),
    });
  }

  obtenerDatosSimulador(idSimulador: number ){
    this.simulatorService.getDatosSimulator(idSimulador).subscribe((res)=>{
      this.nivel = res.data.nivel;
      this.asignatura = res.data.asignatura;
    });
  }

idPregunta:number = 0;

  setData(data: any) {
    if (data && this.simulatorQuestionGroupForm) {

      console.log('Data 123', data.pregunta, data.idTipoPregunta);
      
      this.simulatorQuestionGroupForm.patchValue({
        pregunta: data.pregunta,
        idTipoPregunta: data.idTipoPregunta,
      });
      if(data.idTipoPregunta === 2){
        this.radioSeleccionado1 = data.opcionesRespuestas[0].esCorrecta;
        this.radioSeleccionado2 = data.opcionesRespuestas[1].esCorrecta;
        this.radioSeleccionado3 = data.opcionesRespuestas[2].esCorrecta;
        this.radioSeleccionado4 = data.opcionesRespuestas[3].esCorrecta;

        this.simulatorQuestionGroupForm.patchValue({
          opcionSimple1: data.opcionesRespuestas[0].respuesta,
          opcionSimple2: data.opcionesRespuestas[1].respuesta,
          opcionSimple3: data.opcionesRespuestas[2].respuesta,
          opcionSimple4: data.opcionesRespuestas[3].respuesta,
        });
      }else if(data.idTipoPregunta === 1){
        this.checkboxSeleccionado1 = data.opcionesRespuestas[0].esCorrecta;
        this.checkboxSeleccionado2 = data.opcionesRespuestas[1].esCorrecta;
        this.checkboxSeleccionado3 = data.opcionesRespuestas[2].esCorrecta;
        this.checkboxSeleccionado4 = data.opcionesRespuestas[3].esCorrecta;

        this.simulatorQuestionGroupForm.patchValue({
          opcionMultiple1: data.opcionesRespuestas[0].respuesta,
          opcionMultiple2: data.opcionesRespuestas[1].respuesta,
          opcionMultiple3: data.opcionesRespuestas[2].respuesta,
          opcionMultiple4: data.opcionesRespuestas[3].respuesta,
        });
      }
      this.questionType = data.idTipoPregunta;
      this.idPregunta = data.idPregunta;
    }

    if(this.onlyView == false){
      this.simulatorQuestionGroupForm.disable();
    }
  }

 

  loadTiposPreguntas(){
    this.simulatorService.getTiposPreguntas().subscribe((res:any)=>{
      this.tiposPreguntasType = res.data.map((tipoPregunta: TipoPreguntas) => ({
        label: tipoPregunta.tipoPregunta,
        value: tipoPregunta.idTipoPregunta,
      }))
    });
  }


  selectedActivate(rol: string): boolean {
    let RolValid = false;
    if (rol === 'Estudiante' || rol === 'Docente') {
      RolValid = true;
    }
    return RolValid;
  }
  
  tipoPreguntaSeleccionada: any;
  questionType: number = 0;


  onChange(option:any) {
    this.tipoPreguntaSeleccionada = option;
    this.questionType = option.value;
    console.log(this.tipoPreguntaSeleccionada);

  }
  
  clickControllers(){
    document.getElementById('radio1')?.addEventListener('click', () => {
      this.radioSeleccionado1 = true;
      this.radioSeleccionado2 = false;
      this.radioSeleccionado3 = false;
      this.radioSeleccionado4 = false;
    });
    document.getElementById('radio2')?.addEventListener('click', () => {
      this.radioSeleccionado2 = true;
      this.radioSeleccionado1 = false;
      this.radioSeleccionado3 = false;
      this.radioSeleccionado4 = false;
    });
    document.getElementById('radio3')?.addEventListener('click', () => {
      this.radioSeleccionado3 = true;
      this.radioSeleccionado1 = false;
      this.radioSeleccionado2 = false;
      this.radioSeleccionado4 = false;
    });
    document.getElementById('radio4')?.addEventListener('click', () => {
      this.radioSeleccionado4 = true;
      this.radioSeleccionado1 = false;
      this.radioSeleccionado2 = false;
      this.radioSeleccionado3 = false;
    });
    
    document.getElementById('checkbox1')?.addEventListener('click', () => {
      this.checkboxSeleccionado1 = !this.checkboxSeleccionado1;
    });
    document.getElementById('checkbox2')?.addEventListener('click', () => {
      this.checkboxSeleccionado2 = !this.checkboxSeleccionado2;
    });
    document.getElementById('checkbox3')?.addEventListener('click', () => {
      this.checkboxSeleccionado3 = !this.checkboxSeleccionado3;
    });
    document.getElementById('checkbox4')?.addEventListener('click', () => {
      this.checkboxSeleccionado4 = !this.checkboxSeleccionado4;
    });
  }
 
  // ngSuscribesOnInit() {
    
  //   this.simulatorQuestionGroupForm.valueChanges.subscribe(() => {

  //    this.clickControllers();
  //     if(this.questionType === 2){
  //       this.opcionesRespuestas=[
  //         {respuesta: this.simulatorQuestionGroupForm.get('opcionSimple1')?.value, esCorrecta: this.radioSeleccionado1},
  //         {respuesta: this.simulatorQuestionGroupForm.get('opcionSimple2')?.value, esCorrecta:  this.radioSeleccionado2},
  //         {respuesta: this.simulatorQuestionGroupForm.get('opcionSimple3')?.value, esCorrecta:  this.radioSeleccionado3},
  //         {respuesta: this.simulatorQuestionGroupForm.get('opcionSimple4')?.value, esCorrecta:  this.radioSeleccionado4},
  //       ]
  //     }else if(this.questionType === 1){
  //       this.opcionesRespuestas=[
  //         {respuesta: this.simulatorQuestionGroupForm.get('opcionMultiple1')?.value, esCorrecta: this.checkboxSeleccionado1},
  //         {respuesta: this.simulatorQuestionGroupForm.get('opcionMultiple2')?.value, esCorrecta:  this.checkboxSeleccionado2},
  //         {respuesta: this.simulatorQuestionGroupForm.get('opcionMultiple3')?.value, esCorrecta:  this.checkboxSeleccionado3},
  //         {respuesta: this.simulatorQuestionGroupForm.get('opcionMultiple4')?.value, esCorrecta:  this.checkboxSeleccionado4},
  //       ]

  //     }
  //     const response = {
  //       idSimulador: this.id,
  //       pregunta: this.simulatorQuestionGroupForm.get('pregunta')?.value,
  //       idTipoPregunta: this.questionType,
  //       opcionesRespuestas: this.opcionesRespuestas,
  //     };
      

  //     console.log(response);
  //     this.editedDataEmitter.emit(response);
  //     this.valueFormEmitter.emit(this.simulatorQuestionGroupForm.valid);
  //   });
  // }

}
