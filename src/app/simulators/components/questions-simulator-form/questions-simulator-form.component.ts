import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ModeFormsResources } from '../../../academic-resources/interfaces/recurso.interface';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SimulatorsService } from '../../services/simulators.service';
import { HomeService } from '../../../home/services/home.service';
import { ROLES } from '../../../shared/interfaces/roles.interface';
import { TipoPreguntas } from '../../interfaces/simulators.interface';

@Component({
  selector: 'questions-simulator-form',
  templateUrl: './questions-simulator-form.component.html',
  styles: ``
})
export class QuestionsSimulatorFormComponent implements OnInit, OnChanges{
  @Input() formData: any;
  @Input() modeForm!: ModeFormsResources;
  @Input() idSimulador!: number;
  @Output() editedDataEmitter = new EventEmitter<any>();
  @Output() valueFormEmitter = new EventEmitter<boolean>();
  @Output() asignaturaEmitter = new EventEmitter<any>();


  opcionesRespuestas: any[] = [];
  radioSeleccionado1:boolean = false;
  radioSeleccionado2:boolean = false;
  radioSeleccionado3:boolean = false;
  radioSeleccionado4:boolean = false;

  checkboxSeleccionado1:boolean = false;
  checkboxSeleccionado2:boolean = false;
  checkboxSeleccionado3:boolean = false;
  checkboxSeleccionado4:boolean = false;

  tiposPreguntasType: { label: string; value: string }[] = [];
  asignaturas: { label: string; value: string }[] = [];
  simulatorQuestionGroupForm!: FormGroup;
  currentTypeResource!: string;
  rol: string = '';
  nivel: string = '';
  asignatura: string = '';
  nombreSimulador: string = '';
 

  constructor(
    private fb: FormBuilder,
    private simulatorService: SimulatorsService,
    private homeService: HomeService
  ) {}

  ngOnInit() {
    this.createForm();
    this.loadTiposPreguntas();
    this.obtenerDatosSimulador(this.idSimulador);
    this.homeService.obtenerDatosMenu().subscribe({
      next: (user) => {
        if (user) this.rol = user.data?.rol;
        this.validationsForm();
        this.ngSuscribesOnInit();

        if (this.formData) {
          this.setData(this.formData);
        }
      },
      error: () => {
        window.alert('No cargo la información del Usuario Administrador');
      },
    });
    
    //  this.simulatorQuestionGroupForm.get('radio1')?.valueChanges.subscribe(value => {
    //   this.radioSeleccionado1 = value;
    // });
    
    // this.simulatorQuestionGroupForm.get('radio2')?.valueChanges.subscribe(value => {
    //   this.radioSeleccionado2 = value;
    // });
    // this.simulatorQuestionGroupForm.get('radio3')?.valueChanges.subscribe(value => {
    //   this.radioSeleccionado3 = value;
    // });
    // this.simulatorQuestionGroupForm.get('radio4')?.valueChanges.subscribe(value => {
    //   this.radioSeleccionado4 = value;
    // });

  }

  
  // onOptionChange(event: any, radioNumber: number) {
  //   if (event.target.checked) {
  //     switch(radioNumber) {
  //       case 1:
  //         this.radioSeleccionado1 = true;
  //         break;
  //       case 2:
  //         this.radioSeleccionado2 = true;
  //         break;
  //       case 3:
  //         this.radioSeleccionado3 = true;
  //         break;
  //       case 4:
  //         this.radioSeleccionado4 = true;
  //         break;
  //     }
  //   } else {
  //     switch(radioNumber) {
  //       case 1:
  //         this.radioSeleccionado1 = false;
  //         break;
  //       case 2:
  //         this.radioSeleccionado2 = false;
  //         break;
  //       case 3:
  //         this.radioSeleccionado3 = false;
  //         break;
  //       case 4:
  //         this.radioSeleccionado4 = false;
  //         break;
  //     }
  //   }
  // }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formData']) {
      this.setData(changes['formData'].currentValue);
    }
    
  }

  createForm() {
    this.simulatorQuestionGroupForm = this.fb.group({
      pregunta: ['', Validators.required],
      idTipoPregunta: [null, Validators.required],
      opcionSimple1: [''],
      opcionSimple2: [''],
      opcionSimple3: [''],
      opcionSimple4: [''],
      opcionMultiple1: [''],
      opcionMultiple2: [''],
      opcionMultiple3: [''],
      opcionMultiple4: [''],
      // radio: new FormControl(false),
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

  // obtenerEstadoRadio(): void {
  //   const esSeleccionado = this.simulatorQuestionGroupForm.get('opcionSimple2')?.value === 'list-radio-answer2';
  //   console.log('¿Está seleccionado opcionSimple2?', esSeleccionado);
  // }
  // getFormOptions(){
  //   const formValues = this.simulatorQuestionGroupForm.value;
  //   const opcionesRespuestas=[
  //     {respuesta: formValues.opcionSimple1, esCorrecta: this.simulatorQuestionGroupForm.get('opcionSimple1')?.value === 'list-radio-answer1'},
  //     {respuesta: formValues.opcionSimple2, esCorrecta: this.simulatorQuestionGroupForm.get('opcionSimple2')?.value === 'list-radio-answer2'},
  //     {respuesta: formValues.opcionSimple3, esCorrecta: this.simulatorQuestionGroupForm.get('opcionSimple3')?.value === 'list-radio-answer3'},
  //     {respuesta: formValues.opcionSimple4, esCorrecta: this.simulatorQuestionGroupForm.get('opcionSimple4')?.value === 'list-radio-answer4'},

  //   ]
  // }

  obtenerDatosSimulador(idSimulador: number ){
    this.simulatorService.getDatosSimulator(idSimulador).subscribe((res)=>{
      console.log(res.data.nivel);
      this.nivel = res.data.nivel;
      this.asignatura = res.data.asignatura;
      this.nombreSimulador = res.data.nombreSimulador;
    });
  }

  validationsForm() {
    switch (this.rol) {
      case ROLES.ADMIN:
        // this.recursoGroupForm.get('idNivel')?.disable();
        // this.recursoGroupForm.get('idAsignatura')?.disable();
        // this.recursoGroupForm.get('idEstado')?.disable();
        // this.recursoGroupForm.get('tipoRecurso')?.disable();
        // this.recursoGroupForm.get('enlaceDelRecurso')?.disable();
        // this.recursoGroupForm.get('nombreRecurso')?.disable();
        // this.recursoGroupForm.get('idDocenteRevisor')?.updateValueAndValidity();

        // this.recursoGroupForm.get('observation')?.clearValidators();
        // this.recursoGroupForm.get('observation')?.updateValueAndValidity();

        // this.recursoGroupForm.get('observationArchivo')?.clearValidators();
        // this.recursoGroupForm
        //   .get('observationArchivo')
        //   ?.updateValueAndValidity();

        // this.recursoGroupForm.get('extensionObservaciones')?.clearValidators();
        // this.recursoGroupForm
        //   .get('extensionObservaciones')
        //   ?.updateValueAndValidity();

        break;
      case ROLES.DOCENTE:
        if (this.modeForm === 'Add') {
        //   this.recursoGroupForm.get('idEstado')?.clearValidators();
        //   this.recursoGroupForm.get('idEstado')?.updateValueAndValidity();
        //   this.recursoGroupForm.get('idDocenteRevisor')?.clearValidators();
        //   this.recursoGroupForm
        //     .get('idDocenteRevisor')
        //     ?.updateValueAndValidity();
        //   this.recursoGroupForm.get('observation')?.clearValidators();
        //   this.recursoGroupForm.get('observation')?.updateValueAndValidity();

        //   this.recursoGroupForm.get('observationArchivo')?.clearValidators();
        //   this.recursoGroupForm
        //     .get('observationArchivo')
        //     ?.updateValueAndValidity();

        //   this.recursoGroupForm
        //     .get('extensionObservaciones')
        //     ?.clearValidators();
        //   this.recursoGroupForm
        //     .get('extensionObservaciones')
        //     ?.updateValueAndValidity();
        // } else if (
        //   this.modeForm === 'Edit' ||
        //   this.modeForm === 'Por Aprobar'
        // ) {
        //   this.recursoGroupForm.get('idDocenteRevisor')?.clearValidators();
        //   this.recursoGroupForm
        //     .get('idDocenteRevisor')
        //     ?.updateValueAndValidity();
        //   this.recursoGroupForm.get('observation')?.clearValidators();
        //   this.recursoGroupForm.get('observation')?.updateValueAndValidity();

        //   this.recursoGroupForm.get('observationArchivo')?.clearValidators();
        //   this.recursoGroupForm
        //     .get('observationArchivo')
        //     ?.updateValueAndValidity();

        //   this.recursoGroupForm
        //     .get('extensionObservaciones')
        //     ?.clearValidators();
        //   this.recursoGroupForm
        //     .get('extensionObservaciones')
        //     ?.updateValueAndValidity();
        }
        break;

      default:
      
        break;
    }
  }

  setData(data: any) {
    if (data && this.simulatorQuestionGroupForm) {
      this.simulatorQuestionGroupForm.patchValue({
        pregunta: data.pregunta,
        idTipoPregunta: data.tipoPregunta,
      });

      if (this.rol === ROLES.ESTUDIANTE) {
        console.log({ FORM: this.modeForm });
        if (this.modeForm === 'Edit') {
          // this.recursoGroupForm.get('observation')?.disable();
          // this.recursoGroupForm.get('observation')?.updateValueAndValidity();

          // this.recursoGroupForm.get('idDocenteRevisor')?.disable();
          // this.recursoGroupForm
          //   .get('idDocenteRevisor')
          //   ?.updateValueAndValidity();

          // this.recursoGroupForm.get('observationArchivo')?.disable();
          // this.recursoGroupForm
          //   .get('observationArchivo')
          //   ?.updateValueAndValidity();

          // this.recursoGroupForm.get('extensionObservaciones')?.disable();
          // this.recursoGroupForm
          //   .get('extensionObservaciones')
          //   ?.updateValueAndValidity();
        }

        if (this.modeForm === 'Corregir Recurso') {
          // this.recursoGroupForm.get('idDocenteRevisor')?.disable();
          // this.recursoGroupForm
          //   .get('idDocenteRevisor')
          //   ?.updateValueAndValidity();
        }
      }
      // this.observation = data.observacion;
      // this.idAssign = data.idAsignatura;
      // this.idNiv = data.idNivel;
    }

    if (this.rol === ROLES.ADMIN) {
      // this.recursoGroupForm.get('enlaceDelRecurso')?.disable();
    }

    if (this.rol === ROLES.DOCENTE) {
      // this.recursoGroupForm.get('idDocenteRevisor')?.disable();
      // this.recursoGroupForm.get('idDocenteRevisor')?.updateValueAndValidity();
      // this.recursoGroupForm.get('observation')?.disable();
      // this.recursoGroupForm.get('observation')?.updateValueAndValidity();

      if (this.modeForm === 'Por Aprobar') {
        // this.recursoGroupForm.get('observation')?.enable();
        // this.recursoGroupForm.get('observation')?.updateValueAndValidity();

        // this.recursoGroupForm.disable();
        // this.recursoGroupForm.get('idEstado')?.enable();

        // this.recursoGroupForm.get('idNivel')?.disable();
        // this.recursoGroupForm.get('idAsignatura')?.disable();
        // this.recursoGroupForm.get('tipoRecurso')?.disable();
        // this.recursoGroupForm.get('enlaceDelRecurso')?.disable();
        // this.recursoGroupForm.get('nombreRecurso')?.disable();
      }
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




  // resourceName(value: string): string {
  //   return value.split('/').slice(-1)[0] || '';
  // }
  // observationView: boolean = false;
  // showObservation(rol: string): boolean {
  //   const isStudent = rol === 'Estudiante' && this.observation !== '';
  //   const isDocente =
  //     rol === 'Docente' &&
  //     (this.modeForm === 'Edit' || this.modeForm === 'Por Aprobar') &&
  //     (this.observation !== '' || this.observationView);

  //   let status = false;
  //   if (rol === 'Estudiante') status = isStudent;
  //   if (rol === 'Docente') status = isDocente;

  //   return status;
  // }

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

  // showStatus(rol: string): boolean {
  //   const isDocente = rol === 'Docente';
  //   return isDocente;
  // }

  // canShowStatus() {
  //   let status: boolean = false;
  //   if (this.rol === 'Docente') {
  //     status = this.modeForm === 'Edit' || this.modeForm === 'Por Aprobar';
  //   }

  //   if (this.rol === 'Estudiante') {
  //     status = this.modeForm === 'Corregir Recurso';
  //   }

  //   return status;
  // }
  
 
  ngSuscribesOnInit() {

     
    // if(this.questionType === 2){
    //   this.opcionesRespuestas=[
    //     {respuesta: this.simulatorQuestionGroupForm.get('opcionSimple1')?.value, esCorrecta: this.simulatorQuestionGroupForm.get('opcionSimple1')?.value === 'list-radio-answer1'},
    //     {respuesta: this.simulatorQuestionGroupForm.get('opcionSimple2')?.value, esCorrecta: this.simulatorQuestionGroupForm.get('opcionSimple2')?.value === 'list-radio-answer2'},
    //     {respuesta: this.simulatorQuestionGroupForm.get('opcionSimple3')?.value, esCorrecta: this.simulatorQuestionGroupForm.get('opcionSimple3')?.value === 'list-radio-answer3'},
    //     {respuesta: this.simulatorQuestionGroupForm.get('opcionSimple4')?.value, esCorrecta: this.simulatorQuestionGroupForm.get('opcionSimple4')?.value === 'list-radio-answer4'},
    //   ]
    // }else if(this.questionType === 1){
    //   this.opcionesRespuestas=[
    //     {respuesta: this.simulatorQuestionGroupForm.get('opcionMultiple1')?.value, esCorrecta: this.simulatorQuestionGroupForm.get('opcionMultiple1')?.value === 'answer-checkbox1'},
    //     {respuesta: this.simulatorQuestionGroupForm.get('opcionMultiple2')?.value, esCorrecta: this.simulatorQuestionGroupForm.get('opcionMultiple2')?.value === 'answer-checkbox2'},
    //     {respuesta: this.simulatorQuestionGroupForm.get('opcionMultiple3')?.value, esCorrecta: this.simulatorQuestionGroupForm.get('opcionMultiple3')?.value === 'answer-checkbox3'},
    //     {respuesta: this.simulatorQuestionGroupForm.get('opcionMultiple4')?.value, esCorrecta: this.simulatorQuestionGroupForm.get('opcionMultiple4')?.value === 'answer-checkbox4'},
    //   ]
    // }
    
    this.simulatorQuestionGroupForm.valueChanges.subscribe(() => {

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


      if(this.questionType === 2){
        this.opcionesRespuestas=[
          {respuesta: this.simulatorQuestionGroupForm.get('opcionSimple1')?.value, esCorrecta: this.radioSeleccionado1},
          {respuesta: this.simulatorQuestionGroupForm.get('opcionSimple2')?.value, esCorrecta:  this.radioSeleccionado2},
          {respuesta: this.simulatorQuestionGroupForm.get('opcionSimple3')?.value, esCorrecta:  this.radioSeleccionado3},
          {respuesta: this.simulatorQuestionGroupForm.get('opcionSimple4')?.value, esCorrecta:  this.radioSeleccionado4},
        ]
        console.log('Opciones de respuesta', this.opcionesRespuestas);
      }else if(this.questionType === 1){
        this.opcionesRespuestas=[
          {respuesta: this.simulatorQuestionGroupForm.get('opcionMultiple1')?.value, esCorrecta: this.checkboxSeleccionado1},
          {respuesta: this.simulatorQuestionGroupForm.get('opcionMultiple2')?.value, esCorrecta:  this.checkboxSeleccionado2},
          {respuesta: this.simulatorQuestionGroupForm.get('opcionMultiple3')?.value, esCorrecta:  this.checkboxSeleccionado3},
          {respuesta: this.simulatorQuestionGroupForm.get('opcionMultiple4')?.value, esCorrecta:  this.checkboxSeleccionado4},
        ]
      }
      const response = {
        idSimulador: this.idSimulador,
        pregunta: this.simulatorQuestionGroupForm.get('pregunta')?.value,
        idTipoPregunta: this.questionType,
        opcionesRespuestas: this.opcionesRespuestas,
      };
      

      console.log(response);
      this.editedDataEmitter.emit(response);
      this.valueFormEmitter.emit(this.simulatorQuestionGroupForm.valid);
    });
  }
}
